import {CourseRepository} from "../../domain/repositories/CourseRepository";
import { ICourse,courseId,ICourseData } from "../../domain/entities/ICourse";
import mongoose, { Document } from "mongoose";


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
    
        // Check if the result contains a success flag and the courses array
        if (result.success && result.courses) {
          // Map through the courses to generate signed URLs for the thumbnail
          // const coursesWithSignedThumbnails = await Promise.all(result.courses.map(async (course: any) => {
          //   if (course.thumbnail) {
          //     // Generate the signed URL for the thumbnail using the S3 key stored in the thumbnail field
          //     const signedThumbnailUrl = await this.getObjectSignedUrl(course.thumbnail);
    
          //     // Replace the thumbnail value with the signed URL
          //     course.thumbnail = signedThumbnailUrl;
          //   }
          //   return course; // Return the modified course
          // }));
    
          return {
            ...result,
            courses: result.courses // Return the updated courses array
          };
        }
    
        // Return the original result if it doesn't contain courses or success is false
        return result;
    
      } catch (error) {
        console.log('catch', error);
        throw new Error('Failed to fetch user courses');
      }
    }
    
    
    

    async courseDetails(data: { courseId: string }) {
      try {
          const result = await this.courseRepo.courseDetails(data);
  
          if (result?.courses) {
              // Extract the S3 key and generate a signed URL for the thumbnail
              const thumbnailKey = result.courses.thumbnail;
              const signedThumbnailUrl = await this.getObjectSignedUrl(thumbnailKey);
  
              // Build a new courses object with all required properties, adding thumbnailKey
              const updatedCourses = {
                  ...result.courses.toObject(),  // Convert to a plain object if necessary
                  thumbnail: signedThumbnailUrl,
                  thumbnailKey: thumbnailKey,    // Add the thumbnailKey here
              };
  
              // Return the new result with updated courses object
              return {
                  ...result,
                  courses: updatedCourses,  // Overwrite courses with the modified version
              };
          }
  
          return result;  // Return unmodified result if courses are not found
  
      } catch (error) {
          console.error("Failed to fetch course details", error);
          throw new Error("Failed to fetch course details");
      }
  }
  
  
  
  
  
  
  
  

async allCourses() {
    try {
      console.log('try');
  
      // Fetch all courses from the repository
      const result = await this.courseRepo.allCourses();
  
      // If result is undefined, return an empty array as fallback
      if (!result || !result.courses) {
        return []; // Ensure that we return an empty array when result is undefined
      }
  
      // Iterate over each course and replace the thumbnail key with signed URL
      const coursesWithSignedThumbnails = await Promise.all(
        result.courses.map(async (course: ICourse) => {
          if (course.thumbnail) {
            // Generate signed URL for the thumbnail
            const signedThumbnailUrl = await this.getObjectSignedUrl(course.thumbnail);
            // Replace the thumbnail key with the signed URL
            console.log(signedThumbnailUrl)
            course.thumbnail = signedThumbnailUrl;
          }
          return course;
        })
      );
  
      // Return updated courses array
      return coursesWithSignedThumbnails;
  
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
  
  async  tutorMyCourses(data: any) {
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
        };
    } else {
        console.error(response.message);
        return { success: false, message: response.message };
    }
}


async listCourse(data:courseId){
  try{
      console.log('try');
      const result =await this.courseRepo.listCourse(data)
      return result
      
  }catch(error){
      console.log('catch');
      
  }
}

async courseDataEdit(data: string) {
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


async editCourse(courseData:ICourse){
  try{
      console.log('try');
      const result =await this.courseRepo.editCourse(courseData)
      return result            
  }catch(error){
      console.log('catch');
      
  }
}



async addCourseStudents(data:any){
  try{
      console.log('try');
      const result =await this.courseRepo.addCourseStudents(data)
      return result            
  }catch(error){
      console.log('catch');
      
  }
}


async fetchMyCourseData(data: any) {
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




  


}

