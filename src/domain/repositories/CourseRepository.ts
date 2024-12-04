import { Course,ICourseDocument} from "../../model/course";
import {CourseReport} from "../../model/report";
import { ICourse,ReturnResponse,PaginationData,Ilesson,ISections,ReportData,ReportWithCourseData, ICourseReport,TutorPagination,tutorMyCourses,
  UserCourse,userMyCourseResponse,userMyCourseRequest,GraphCourseInput,GraphCourseOutput,AllCoursesResponse,ICourseData
} from "../entities/ICourse";
import { ICourseRepository} from "./ICourseRepository";
import mongoose from "mongoose";
import { ObjectId } from 'mongodb';
import {CourseReview} from "../../model/review";



export class CourseRepository implements ICourseRepository{
  // Implementing saveCourse method
  // Implementing saveCourse method
  async saveCourse(courseData: ICourse) {
    try {
      // Prepare the courseData object according to the updated schema
      const newCourseData = {
        tutorId: courseData.tutorId,
        courseName: courseData.courseName,  // Updated to match the schema
        courseDescription: courseData.courseDescription,  // Updated to match the schema
        coursePrice: Number(courseData.coursePrice), // Convert to number
        courseDiscountPrice: courseData.courseDiscountPrice ? Number(courseData.courseDiscountPrice) : undefined, // Convert if exists
        courseCategory: courseData.courseCategory,  // Updated to match the schema
        courseLevel: courseData.courseLevel,  // Directly mapped if names match
        demoURL: courseData.demoURL,  // Directly mapped
        thumbnail: courseData.thumbnail,  // Directly mapped
        benefits: courseData.benefits,  // Directly mapped
        prerequisites: courseData.prerequisites,  // Directly mapped
        isListed:true,
        sections: courseData.sections.map(section => ({
          title: section.title, // Ensure title is provided
          lessons: section.lessons.map(lesson => ({
            title: lesson.title, // Ensure lesson title is provided
            description: lesson.description || "", // Default to empty string if not provided
            video: lesson.video // Assuming video is being set correctly
          }))
        }))

      };
  
      // Create a new course instance
      const newCourse = new Course(newCourseData);
      await newCourse.save();
      console.log('Course saved successfully');
      return { success: true, message: "Course saved successfully" };
  
    } catch (error) {
      console.log('saveCourse error', error);
      return { success: false, message: "Course couldn't save. Please try again" };
    }
  }
  
  

  async userCourse() {
    try {
      // Fetch courses where isListed is true, limit to 3 courses
      const allCourses = await Course.find({ isListed: true }).limit(3);
      console.log('All courses:', allCourses);
  
      if (allCourses && allCourses.length > 0) {
        // Iterate through each course and fetch the average rating from the Review collection
        const coursesWithRatings = await Promise.all(
          allCourses.map(async (course) => {
            // Find the reviews related to the current course
            const reviews = await CourseReview.find({ courseId: course._id });

            console.log(reviews,course._id,"test test")
  
            // Calculate the average rating
            let averageRating = 0;
            if (reviews.length > 0) {
              const totalRating = reviews.reduce((sum:any, review:any) => sum + review.rating, 0);
              averageRating = totalRating / reviews.length; // Average of all ratings
            }

            console.log(averageRating)
  
            // Return the course with the average rating added
            return {
              ...course.toObject(), // Spread the course data
              averageRating, // Add the average rating
            };
          })
        );

        console.log(coursesWithRatings,"popo")
  
        return {
          courses: coursesWithRatings,
          message: 'Courses fetched successfully',
          success: true,
        };
      }
  
      return {
        courses: [],
        message: 'No courses found.',
        success: false,
      };
    } catch (error) {
      console.log('Error fetching courses:', error);
      return {
        success: false,
        message: 'Error fetching courses. Please try again.',
      };
    }
  }
  


  async courseDetails(data: { courseId: string }) {
    try {
      const { courseId } = data;
  
      // Fetch the course details
      const courseDetails = await Course.findOne({ _id: courseId });
  
      if (courseDetails) {
        // Fetch all reviews for the course
        const reviews = await CourseReview.find({ courseId });
  
        // Calculate the average rating
        let averageRating = 0;
        if (reviews.length > 0) {
          const totalRating = reviews.reduce(
            (sum: number, review: any) => sum + review.rating,
            0
          );
          averageRating = totalRating / reviews.length;
        }
  
        // Return the course with the average rating
        return {
          courses: { ...courseDetails.toObject(), averageRating },
          courseId: courseDetails._id,
          message: "Fetching course went successfully",
          success: true,
        };
      }
  
      return {
        success: false,
        message: "No course found.",
      };
    } catch (error) {
      console.log("Fetch course error:", error);
      return {
        success: false,
        message: "Course fetch error. Please try again.",
      };
    }
  }
  
  


async allCourses(data: PaginationData ): Promise<AllCoursesResponse> {
  try {
    const { skip, limit } = data;

    const totalCourses = await Course.countDocuments({ isListed: true });

    const courses = await Course.find({ isListed: true })
      .skip(skip)
      .limit(limit);

    if (courses && courses.length > 0) {
      const coursesWithRatings = await Promise.all(
        courses.map(async (course) => {
          const reviews = await CourseReview.find({ courseId: course._id });

          // Calculate the average rating
          let averageRating = 0;
          if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
            averageRating = totalRating / reviews.length;
          }

          // Return the course with the average rating added
          return {
            ...course.toObject(), // Spread the course data
            averageRating, // Add the average rating
          };
        })
      );

      return {
        courses: coursesWithRatings, // Paginated courses with average ratings
        totalCount: totalCourses, // Total count of courses
        message: "Courses fetched successfully",
        success: true,
      };
    }

    return {
      courses: [],
      totalCount: totalCourses,
      message: "No courses found.",
      success: false,
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { success: false, message: "Failed to fetch courses. Please try again." };
  }
}




async tutorMyCourses(data: TutorPagination): Promise<tutorMyCourses> {
  try {
      const { tutorId,skip,limit} = data;
      const courseDetails = await Course.find({ tutorId })
          .select('courseName thumbnail coursePrice courseDiscountPrice courseCategory courseLevel createdAt isListed').skip(skip).limit(limit)
          .exec();
      
          const totalCount = await Course.countDocuments({tutorId});

      // Convert Mongoose documents to plain objects if necessary
      const courses = courseDetails.map(course => course.toObject()); // Use toObject()

      return {
          courses: courses || [], // Ensure this is an array
          message: 'Fetching courses went successfully',
          success: true,
          totalCount
      };
  } catch (error) {
      console.error('Fetch all course error:', error);
      return { success: false, message: 'Failed to fetch courses. Please try again', courses: [] };
  }
}



async listCourse(data: TutorPagination):Promise<tutorMyCourses>{
  try {
    const { skip , limit , tutorId } = data;

    console.log("tutors")

    // Fetch the total count of documents
    const totalCount = await Course.countDocuments();

    // Fetch courses with pagination
    const courses = await Course.find({tutorId})
      .skip(skip)
      .limit(limit);

    if (!courses || courses.length === 0) {
      return { success: false, message: "No courses found", totalCount: 0, courses: [] };
    }

    return {
      success: true,
      message: "Courses fetched successfully",
      totalCount, // Total count of all courses
      courses, // Paginated course data
    };
  } catch (error) {
    console.error("Fetch courses error:", error);
    return {
      success: false,
      message: "Failed to fetch courses. Please try again.",
      totalCount: 0,
      courses: [],
    };
  }
}



async editCourse(courseData: ICourseData) {
  try {
    // Prepare the courseData object according to the updated schema
    const courseExist = await Course.findOne({_id: courseData.courseId});

    if (!courseExist) {
      return { success: false, message: "Course does not exist" };
    }

    // Update course data
    const updatedCourseData = {
      tutorId: courseData.tutorId,
      courseName: courseData.courseName,  // Updated to match the schema
      courseDescription: courseData.courseDescription,  // Updated to match the schema
      coursePrice: Number(courseData.coursePrice), // Convert to number
      courseDiscountPrice: courseData.courseDiscountPrice ? Number(courseData.courseDiscountPrice) : undefined, // Convert if exists
      courseCategory: courseData.courseCategory,  // Updated to match the schema
      courseLevel: courseData.courseLevel,  // Directly mapped if names match
      demoURL: courseData.demoURL,  // Directly mapped
      thumbnail: courseData.thumbnail,  // Directly mapped
      benefits: courseData.benefits,  // Directly mapped
      prerequisites: courseData.prerequisites,  // Directly mapped
      isListed: true, // Assuming you want to keep it listed
      sections: courseData.sections.map((section: ISections) => ({
        title: section.title, // Ensure title is provided
        lessons: section.lessons.map((lesson: Ilesson) => ({
          title: lesson.title, // Ensure lesson title is provided
          description: lesson.description || "", // Default to empty string if not provided
          video: lesson.video // Assuming video is being set correctly
        }))
      }))
    };

    // Update the existing course with new data
    await Course.updateOne({ _id: courseData.courseId }, { $set: updatedCourseData });
    console.log('Course updated successfully');
    return { success: true, message: "Course updated successfully" };

  } catch (error) {
    console.log('editCourse error', error);
    return { success: false, message: "Course couldn't be updated. Please try again" };
  }
}


async addCourseStudents(data: UserCourse) {
  try {
    const { userId, courseId } = data;

    // Update the course by pushing the userId and enrollment date into the students array
    const addStudents = await Course.updateOne(
      { _id: courseId },  // Find the course by ID
      { 
        $push: { 
          students: { 
            studentId: userId, // Add the studentId
            enrolledDate: new Date() // Add the enrollment date (default is now)
          } 
        } 
      }
    );

    console.log('add students', addStudents);

    // Check if the course was updated successfully
    if (addStudents.modifiedCount === 0) {
      return { success: false, message: "Course not found or user already added." };
    }

    return { success: true, message: "Student added successfully." };

  } catch (error) {
    console.log('fetch add students error', error);
    return { success: false, message: "Failed to add students to course. Please try again." };
  }
}



async fetchMyCourseData(courseIds: mongoose.Schema.Types.ObjectId[]) {
  try {
    // Fetch course details by matching the array of courseIds
    const courseDetails = await Course.find(
      { _id: { $in: courseIds } }, // Match the _id with the courseIds array
      'courseName _id thumbnail' // Only select courseName, _id, and thumbnail fields
    ).exec();
    
    if (!courseDetails || courseDetails.length === 0) {
      console.log("No courses found for the given course IDs.");
      return { success: false, message: "No courses found." };
    }

    console.log('Fetched courseDetails:', courseDetails);

    // Return the course details in the required format
    return {
      success: true,
      courses: courseDetails // This will contain an array of courseName, _id, and thumbnail
    };
  } catch (error) {
    console.log('fetch all course error:', error);
    return { success: false, message: "Failed to fetch courses. Please try again." };
  }
}


async userMyCourses(data: userMyCourseRequest): Promise<userMyCourseResponse> {
  try {
    console.log(data, "data");
    
    // Check if data.myCourse is defined and is an array
    if (!data.courses || !Array.isArray(data.courses)) {
      console.log("myCourse is undefined or not an array");
      return {
        success: false,
        message: "Invalid course data received.",
      };
    }

    // Extract courseId from the myCourse data
    const courseIds = data.courses.map((course: any) => course.courseId);

    // Fetch courses using the courseIds and select required fields
    const courses = await Course.find(
      { _id: { $in: courseIds } },
      "_id courseName courseDescription thumbnail courseCategory courseLevel" // Specify fields to select
    );

    console.log("Fetched Courses:", courses);

    if (courses.length > 0) {
      // Map courses to ensure _id is a string
      const formattedCourses = courses.map((course) => ({
        ...course.toObject(), // Convert Mongoose document to plain object
        _id: (course._id as mongoose.Types.ObjectId).toString(), // Assert _id is ObjectId and convert to string
      }));

      return {
        courses: formattedCourses,
        message: "Fetching courses was successful",
        success: true,
      };
    } else {
      return {
        message: "No courses found for the user",
        success: false,
      };
    }
  } catch (error) {
    console.log("Fetch all courses error:", error);
    return {
      success: false,
      message: "Error fetching courses. Please try again.",
    };
  }
}




async  fetchCourseDetails(courseId: string) {
  try {
    const courseData = await Course.findById(courseId).where({ isListed: true });
    console.log('Course Data:', courseData);

    if (courseData) {
      return { course: courseData, message: 'Course fetched successfully', success: true };
    } else {
      return { success: false, message: 'Course not found or not listed' };
    }
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    return { success: false, message: 'Error fetching course details. Please try again.' };
  }
}



async  courseViewDetails(courseId: string) {
  try {

    console.log(courseId,"-------------------------------------------------------------")
    const courseData = await Course.findById(courseId).where({ isListed: true });
    console.log('Course Data:', courseData);

    if (courseData) {
      return { courses: courseData,courseId:courseId, message: 'Course fetched successfully', success: true };
    } else {
      return { success: false, message: 'Course not found or not listed' };
    }
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    return { success: false, message: 'Error fetching course details. Please try again.' };
  }
}


async report(data: ReportData) {
  try {
    const { courseId, userId, username, email, reason, description } = data;

    const newReport = new CourseReport({
      courseId,
      userId,
      username,
      email,
      reason,
      description,
      createdAt: new Date()
    });

    await newReport.save();

    return { success: true, message: 'Report submitted successfully.' };
  } catch (error) {
    console.error('Error saving report:', error);
    return { success: false, message: 'Error submitting the report. Please try again.' };
  }
}




async reportCourses(): Promise<ReportWithCourseData[] | ReturnResponse> {
  try {
      // Explicitly type the course reports
      const courseReports = await CourseReport.find({}).lean().exec() as ICourseReport[];

      if (!courseReports.length) {
          return { success: true, message: 'No course reports found.' };
      }

      // Extract course IDs and ensure they're ObjectIds
      const courseIds = courseReports.map(report => {
          if (mongoose.Types.ObjectId.isValid(report.courseId)) {
              return new mongoose.Types.ObjectId(report.courseId);
          }
          throw new Error(`Invalid courseId: ${report.courseId}`);
      });

      // Fetch courses with `isListed` included
      const courses = await Course.find({
          _id: { $in: courseIds }
      })
      .select('courseName thumbnail isListed') // Include `isListed`
      .lean()
      .exec() as Pick<ICourseDocument, '_id' | 'courseName' | 'thumbnail' | 'isListed'>[];

      // Create a type-safe mapping
      const courseMap = new Map<string, { courseName: string; thumbnail: string; isListed: boolean }>();
      courses.forEach((course) => {
        const courseId = (course._id as mongoose.Types.ObjectId).toString(); 
        courseMap.set(courseId, {
            courseName: course.courseName,
            thumbnail: course.thumbnail,
            isListed: course.isListed,
        });
    });
    

      // Map the reports with proper type safety, including `isListed`
      const reportsWithCourseData: ReportWithCourseData[] = courseReports.map(report => {
          const courseDetails = courseMap.get(report.courseId.toString()); // Ensure courseId is converted to string

          return {
              courseId: report.courseId.toString(), // Convert ObjectId to string
              courseName: courseDetails?.courseName || 'Unknown Course',
              thumbnail: courseDetails?.thumbnail || 'default_thumbnail.jpg',
              isListed: courseDetails?.isListed ?? false, // Default to `false` if `isListed` is not available
              userId: report.userId.toString(), // Convert ObjectId to string
              username: report.username,
              email: report.email,
              reason: report.reason,
              description: report.description,
              createdAt: report.createdAt,
          };
      });

      console.log(reportsWithCourseData, "final-----------------------");

      return reportsWithCourseData;

  } catch (error) {
      console.error('Error fetching course reports:', error);
      return { success: false, message: 'Error fetching course reports. Please try again.' };
  }
}




 async graphCourses(data: GraphCourseInput[]): Promise<GraphCourseOutput[] | { success: boolean; message: string }> {
  try {
    // Process the input data to fetch course details
    const updatedData = await Promise.all(
      data.map(async (item: GraphCourseInput): Promise<GraphCourseOutput> => {
        // Fetch the course details by courseId
        const course = await Course.findOne({ _id: item.courseId }).select('courseName').lean();

        // Add courseName to the item if found, otherwise default to an empty string
        return {
          ...item,
          courseName: course ? course.courseName : ''
        };
      })
    );

    return updatedData;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return { success: false, message: 'Error submitting the report. Please try again.' };
  }
}


async  notifyCourseData(roomId:string) {
  try {
     const courseName = await Course.findOne({ _id: roomId }).select('courseName thumbnail isListed') ;
     return courseName
  } catch (error) {
    console.error('Error fetching courses:', error);
    return { success: false, message: 'Error submitting the report. Please try again.' };
  }
}




async storeReview(
  courseId: string,
  id: string,
  username: string,
  profilePicture: string,
  userRating: number,
  reviewText: string
) {
  try {
    console.log("Review Data Check:", {
      courseId,
      id,
      username,
      profilePicture,
      userRating,
      reviewText
    });

    // Check if the user has already submitted a review for this course
    const existingReview = await CourseReview.findOne({
      courseId: new mongoose.Types.ObjectId(courseId),
      userId: new mongoose.Types.ObjectId(id),
    });

    if (existingReview) {
      return { success: false, message: "Can't give more than one review." };
    }

    // If no existing review, create a new review
    const review = new CourseReview({
      courseId: new mongoose.Types.ObjectId(courseId),
      userId: new mongoose.Types.ObjectId(id),
      username,
      profilePicture,
      rating: userRating,
      reviewText,
    });

    // Save the review to the database
    await review.save();

    return { success: true, message: "Review submitted successfully.", review };
  } catch (error) {
    console.error("Error submitting review:", error);
    return { success: false, message: "Error submitting the review. Please try again." };
  }
}





async fetchReview(courseId: string){
  try {
    // Find all reviews matching the given courseId
    console.log("kakallalalal")
    const reviews = await CourseReview.find({ courseId: new mongoose.Types.ObjectId(courseId) });

    return { success: true, message: 'Reviews fetched successfully.', reviews };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return { success: false, message: 'Error fetching the reviews. Please try again.' };
  }
}


async TotalCourses() {
  try {
    const totalListedCourses = await Course.countDocuments({ isListed: true });

    console.log("Total number of listed courses:", totalListedCourses);
    return totalListedCourses || 0 ;
  } catch (error) {
    console.error('Error fetching total courses:', error);
    return { success: false, message: 'Error fetching the total courses. Please try again.' };
  }
}


}




