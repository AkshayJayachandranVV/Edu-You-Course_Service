import {CourseRepository} from "../../domain/repositories/CourseRepository";
import { ICourse,courseId,ICourseData,ReportData,ReviewData,MyCoursesRequest,TutorPagination,PaginationData,UserCourse,
  GraphCourseInput
} from "../../domain/entities/ICourse";
import mongoose, { AnyBulkWriteOperation, Document } from "mongoose";


import { S3Client, GetObjectCommand,PutObjectCommand} from '@aws-sdk/client-s3'

import {getSignedUrl} from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
});



export class CourseService {
    private courseRepo : CourseRepository;

    constructor() {
        this.courseRepo = new CourseRepository();
      }

      async addCourse(courseData:ICourse){
        try{
            console.log('try');
            const result =await this.courseRepo.saveCourse(courseData)
            return result            
        }catch(error){
            console.log('catch');
            
        }
    }


    async userCourse() {
      try {
        console.log('try');
    
        // Fetch the user courses from the repository
        const result = await this.courseRepo.userCourse();

        if(!result){
          return
        }
    
        if (result.success && result.courses) {
    
          return {
            ...result,
            courses: result.courses 
          };
        }
    
        return result;
    
      } catch (error) {
        console.log('catch', error);
        throw new Error('Failed to fetch user courses');
      }
    }
    
    
    

    async courseDetails(data:courseId) {
      try {
        const result = await this.courseRepo.courseDetails(data);
    
        console.log("Result:", result);
    
        if (result?.courses) {
          // Convert Mongoose document to plain object if necessary
          const coursesData =result.courses
    
          // Generate a signed URL for the thumbnail
          const thumbnailKey = coursesData.thumbnail;
          const signedThumbnailUrl = await this.getObjectSignedUrl(thumbnailKey);
    
          // Return the updated course details with the signed thumbnail URL
          return {
            ...result,
            courses: {
              ...coursesData,
              thumbnail: signedThumbnailUrl,
              thumbnailKey,
            },
          };
        }
    
        return result; // Return unmodified result if no courses are found
      } catch (error) {
        console.error("Failed to fetch course details:", error);
        throw new Error("Failed to fetch course details");
      }
    }
    
    
  
  
  
  
  
  
  
    async allCourses(data: PaginationData): Promise<any> {
      try {
        console.log('try');
      
        const result = await this.courseRepo.allCourses(data);
    
        // If result is undefined or empty courses, return a response with an empty array for courses
        if (!result || !result.courses || result.courses.length === 0) {
          return {
            courses: [], // Empty array for courses
            totalCount: 0, // No courses found
            message: "No courses found.",
            success: false,
          };
        }
      
        // Iterate over each course and replace the thumbnail key with signed URL
        const coursesWithSignedThumbnails = await Promise.all(
          result.courses.map(async (course: ICourse) => {
            if (course.thumbnail) {
              // Generate signed URL for the thumbnail
              const signedThumbnailUrl = await this.getObjectSignedUrl(course.thumbnail);
              // Replace the thumbnail key with the signed URL
              course.thumbnail = signedThumbnailUrl;
            }
            return course;
          })
        );
      
        // Return the courses with signed thumbnails and average ratings
        return {
          totalCount: result.totalCount,
          courses: coursesWithSignedThumbnails,
          message: "Courses fetched successfully",
          success: true,
        };
    
      } catch (error) {
        console.log('catch', error);
        throw error; // Ensure the error is propagated
      }
    }
    


  
  async getObjectSignedUrl(key: string): Promise<string> {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME!, // Ensure this env variable is set correctly
      Key: key
    };
  
    // Generate the pre-signed URL with expiry time
    const command = new GetObjectCommand(params);
    const seconds = 604800 ; // Set the expiry duration
    const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });
  
    return url;
  }



  
  async  tutorMyCourses(data: TutorPagination) {
    const response = await this.courseRepo.tutorMyCourses(data);
    
    if (response.success) {
        const updatedCourses = await Promise.all(
            response.courses.map(async (course: ICourse) => {
                if (course.thumbnail) {
                    const signedUrl = await this.getObjectSignedUrl(course.thumbnail); // Assume this function exists
                    return {
                        ...course,
                        thumbnail: signedUrl, // Replace the thumbnail with the signed URL
                    };
                }
                return course; // Return the course as-is if there’s no thumbnail    
            })
        );

        return {
            success: true,
            courses: updatedCourses,
            totalCount:response.totalCount
        };
    } else {
        console.error(response.message);
        return { success: false, message: response.message };
    }
}


async listCourse(data: TutorPagination) {
  try {
    console.log("try");

    // Fetch paginated course data from repository
    const result = await this.courseRepo.listCourse(data);

    if (!result.success) {
      return result; // If repository call fails, return the result as is
    }

    // Map through the courses and update thumbnail to S3 signed URL
    const updatedCourses = await Promise.all(
      result.courses.map(async (course: any) => {
        course.thumbnail = await this.getObjectSignedUrl(course.thumbnail);
        return course;
      })
    );

    // Return updated data with signed URLs
    return {
      ...result,
      courses: updatedCourses,
    };
  } catch (error) {
    console.error("Error in listCourse:", error);
    return {
      success: false,
      message: "An error occurred while fetching courses.",
      totalCount: 0,
      courses: [],
    };
  }
}


async courseDataEdit(data: courseId) {
  try {
    console.log('courseDataEdit------------------edit --------------------------');

    const response = await this.courseRepo.courseDetails(data);

    if (!response || !response.courses || !response.courseId) {
      console.error("Failed to fetch course data:", response?.message);
      return null; // Handle unsuccessful responses
    }

    const courseData = response.courses as ICourse;
    const courseId = response.courseId.toString(); // Convert courseId to string

    // Convert Date fields to strings
    const createdAt = courseData.createdAt?.toISOString();

    // Get signed URL for thumbnail
    const thumbnailUrl = await this.getObjectSignedUrl(courseData.thumbnail);

    // Update the lessons in each section to add displayVideo
    const sectionsWithUpdatedLessons = await Promise.all(courseData.sections.map(async (section: any) => {
      const updatedLessons = await Promise.all(section.lessons.map(async (lesson: any) => {
        // Generate the signed video URL using the lesson video key
        const displayVideo = await this.getObjectSignedUrl(lesson.video);
        return {
          ...lesson,
          displayVideo  // Add displayVideo field
        };
      }));
    
      return {
        _id: section._id,
        title: section.title,
        description: section.description,  // Ensure description is included
        lessons: updatedLessons
      };
    }));

    // Construct the final structured course data
    const structuredCourseData: ICourseData = {
      tutorId: courseData.tutorId,
      courseName: courseData.courseName,
      courseDescription: courseData.courseDescription,
      thumbnail: courseData.thumbnail,
      thumbnailUrl,
      coursePrice: courseData.coursePrice,
      courseDiscountPrice: courseData.courseDiscountPrice,
      courseCategory: courseData.courseCategory,
      courseLevel: courseData.courseLevel,
      demoURL: courseData.demoURL,
      prerequisites: courseData.prerequisites,
      benefits: courseData.benefits,
      sections: sectionsWithUpdatedLessons,  // Use updated sections
      createdAt,
      isListed: courseData.isListed,
    };

    // Log the structured data for debugging
    console.log('Structured course data:', structuredCourseData);

    // Return the structured data to be used in the UI
    return {
      courses: structuredCourseData,
      courseId: courseId,
      message: 'Fetching course went successful',
      success: true
    };

  } catch (error) {
    console.error('Error fetching course details:', error);
    return null;
  }
}


async editCourse(courseData:ICourseData){
  try{
      console.log('try');
      const result =await this.courseRepo.editCourse(courseData)
      return result            
  }catch(error){
      console.log('catch');
      
  }
}



async addCourseStudents(data:UserCourse){
  try{
      console.log('try');
      const result =await this.courseRepo.addCourseStudents(data)
      return result            
  }catch(error){
      console.log('catch');
      
  }
}


async fetchMyCourseData(data: mongoose.Schema.Types.ObjectId[]) {
  try {
    console.log('Fetching course data');
    const result = await this.courseRepo.fetchMyCourseData(data);

    // Check if the result contains courses and if they are in an array
    if (result.success && result.courses && result.courses.length > 0) {
      // Map over the courses and fetch signed URLs for the thumbnails
      const coursesWithSignedUrls = await Promise.all(result.courses.map(async (course: any) => {
        const signedUrl = await this.getObjectSignedUrl(course.thumbnail);
        return {
          ...course, // Spread the course data
          thumbnail: signedUrl, // Replace thumbnail with signed URL
        };
      }));

      return {
        success: true,
        courses: coursesWithSignedUrls,
      };
    } else {
      console.log('No courses found or an error occurred.');
      return {
        success: false,
        message: result.message || 'No courses found',
      };
    }
  } catch (error) {
    console.log('Error fetching course data', error);
    return {
      success: false,
      message: 'Error fetching course data',
    };
  }
}


async userMyCourses(data: MyCoursesRequest) {
  try {
    console.log(data, "Data for fetching courses");

    const result = await this.courseRepo.userMyCourses(data);

    // Check if result.courses is defined and is an array
    if (!result.courses || !Array.isArray(result.courses)) {
      console.log('No courses found or invalid data structure.');
      return { success: false, message: 'No courses available.' };
    }

    // Convert S3 keys to signed URLs for the thumbnails
    const coursesWithSignedUrls = await Promise.all(
      result.courses.map(async (course: any) => {
        // Replace the original thumbnail URL with the signed URL
        const signedUrl = await this.getObjectSignedUrl(course.thumbnail);
        course.thumbnail = signedUrl;  // Overwrite the existing thumbnail with the signed URL
        return course;  // Return the updated course object
      })
    );

    // Return the updated courses with signed URLs
    return {
      success: true,
      courses: coursesWithSignedUrls,
    };

  } catch (error) {
    console.log('Error in userMyCourses:', error);
    return {
      success: false,
      message: 'Error fetching courses. Please try again.',
    };
  }
}



async courseViewDetails(data: { courseId: string }) {
  try {
    console.log('Attempting to fetch course details for view...');

    const { courseId } = data;
    const response = await this.courseRepo.courseViewDetails(courseId);

    console.log(response)

    if (!response || !response.courses || !response.courseId) {
      console.error("Failed to fetch course data:", response?.message);
      return {
        success: false,
        message: "Error fetching course details. Please try again.",
      };
    }

    const courseData = response.courses as ICourse;
    const courseIdStr = response.courseId.toString(); // Convert courseId to string if needed

    // Convert Date fields to strings
    const createdAt = courseData.createdAt?.toISOString();

    // Get signed URL for thumbnail
    const thumbnailUrl = await this.getObjectSignedUrl(courseData.thumbnail);

    // Update the lessons in each section to add displayVideo
    const sectionsWithUpdatedLessons = await Promise.all(courseData.sections.map(async (section: any) => {
      const updatedLessons = await Promise.all(section.lessons.map(async (lesson: any) => {
        // Generate signed video URL for each lesson's video key
        const displayVideo = await this.getObjectSignedUrl(lesson.video);
        return {
          ...lesson,
          displayVideo  // Add displayVideo field
        };
      }));

      return {
        _id: section._id,
        title: section.title,
        description: section.description,  // Ensure description is included
        lessons: updatedLessons
      };
    }));

    // Construct the final structured course data
    const structuredCourseData: ICourseData = {
      tutorId: courseData.tutorId,
      courseName: courseData.courseName,
      courseDescription: courseData.courseDescription,
      thumbnail: courseData.thumbnail,
      thumbnailUrl,
      coursePrice: courseData.coursePrice,
      courseDiscountPrice: courseData.courseDiscountPrice,
      courseCategory: courseData.courseCategory,
      courseLevel: courseData.courseLevel,
      demoURL: courseData.demoURL,
      prerequisites: courseData.prerequisites,
      benefits: courseData.benefits,
      sections: sectionsWithUpdatedLessons,  // Use updated sections
      createdAt,
      isListed: courseData.isListed,
    };

    // Log structured data for debugging
    console.log('Structured course data:', structuredCourseData);

    // Return structured data to be used in the UI
    return {
      courses: structuredCourseData,
      courseId: courseIdStr,
      message: 'Fetching course for view was successful',
      success: true
    };

  } catch (error) {
    console.error('Error fetching course details for view:', error);
    return {
      success: false,
      message: "Error fetching course details. Please try again.",
    };
  }
}



async report(data:ReportData){
  try{
      console.log('try');
      const result =await this.courseRepo.report(data)
      return result            
  }catch(error){
      console.log('catch');
      
  }
}

async reportCourses() {
  try {
      console.log('try');
      
      // Retrieve the report data with thumbnails as S3 keys
      const result = await this.courseRepo.reportCourses();

      // Ensure `result` is an array before proceeding
      if (!Array.isArray(result)) {
          console.log('Invalid report data:', result);
          return { success: false, message: 'Failed to retrieve course reports.' };
      }

      // Replace each `thumbnail` key with a signed URL
      const reportsWithSignedUrls = await Promise.all(
          result.map(async (report) => {
              // Get signed URL for the S3 key in `thumbnail`
              const signedUrl = await this.getObjectSignedUrl(report.thumbnail);
              
              // Return the report with the updated `thumbnail`
              return {
                  ...report,
                  thumbnail: signedUrl
              };
          })
      );

      console.log(reportsWithSignedUrls, "final-----------------------");
      return reportsWithSignedUrls;

  } catch (error) {
      console.error('Error in reportCourses:', error);
      return { success: false, message: 'Error fetching course reports with signed URLs.' };
  }
}



async graphCourses(data:GraphCourseInput[]){
  try{
      console.log('try',data);
      const result =await this.courseRepo.graphCourses(data)
      return result            
  }catch(error){
      console.log('catch');
      
  }
}



async notifyCourseData(data:{roomId:string}){
  try{
      console.log('try',data);
      const {roomId} = data
      const result =await this.courseRepo.notifyCourseData(roomId)
      return result            
  }catch(error){
      console.log('catch');
      
  }
}


async storeReview(data: ReviewData) {
  try {
    console.log("Received data:", data);  // Log incoming data to check all fields

    // Correct the destructuring to match the received data structure
    const { courseId, rating, reviewText, id, username, profilePicture } = data;

    if (!rating) {
      console.error("Rating is missing or undefined.");
      return { success: false, message: "Rating is required." };
    }

    // Pass the correct field names to the repository method
    const result = await this.courseRepo.storeReview(
      courseId,
      id,
      username,
      profilePicture,
      rating,
      reviewText
    );
    return result;
  } catch (error) {
    console.log("Error in storeReview method:", error);
    return { success: false, message: "Error submitting the review. Please try again." };
  }
}





async fetchReview(data:courseId){
  try{
      console.log('try',data);
      const {courseId} = data


      const result =await this.courseRepo.fetchReview(courseId)
      return result            
  }catch(error){
      console.log('catch');
      
  }
}


async TotalCourses(){
  try{
      console.log('try');


      const result =await this.courseRepo.TotalCourses()
      return result            
  }catch(error){
      console.log('catch');
      
  }
}


async listUnlist(data:any){
  try{
      console.log('try');


      const result =await this.courseRepo.listUnlist(data)
      return result            
  }catch(error){
      console.log('catch');
      
  }
}

}



