import { Course,ICourseDocument} from "../../model/course";
import {CourseReport} from "../../model/report";
import { ICourse,courseId,MyCoursesResponse,Ilesson,ISections,ReportData,ReportWithCourseData, ICourseReport} from "../entities/ICourse";
import { ICourseRepository} from "./ICourseRepository";
import mongoose from "mongoose";
import { ObjectId } from 'mongodb';



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
  
  

async userCourse(){
  try{
      const allCourse=await Course.find({isListed:true}).limit(3);
      console.log('allcourse',allCourse

      )
      if(allCourse){
          return {courses:allCourse,message:'Fetching course  went successfult',success:true}
      }
  }catch(error){
      console.log('fetch all course error',error);
      return { success: false, message: "Course fetch courses. Please try again" };
      
  }
}


async courseDetails(data:any){
  try{

    const {courseId} = data
      const courseDetails=await Course.findOne({_id:courseId});
      console.log('courseDetails',courseDetails

      )
      if(courseDetails){
          return {courses:courseDetails,courseId:courseDetails._id,message:'Fetching course  went successfult',success:true}
      }
  }catch(error){
      console.log('fetch all course error',error);
      return { success: false, message: "Course fetch courses. Please try again" };
      
  }
}


async allCourses(){
  try{

      const allCourses=await Course.find({isListed:true});
      console.log('allCourses',allCourses)



      if(allCourses){
          return {courses:allCourses,message:'Fetching course  went successfult',success:true}
      }
  }catch(error){
      console.log('fetch all course error',error);
      return { success: false, message: "Course fetch courses. Please try again" };
      
  }
}


async tutorMyCourses(data: any): Promise<MyCoursesResponse> {
  try {
      const { tutorId } = data;
      const courseDetails = await Course.find({ tutorId })
          .select('courseName thumbnail coursePrice courseDiscountPrice courseCategory courseLevel createdAt isListed')
          .exec();

      // Convert Mongoose documents to plain objects if necessary
      const courses = courseDetails.map(course => course.toObject()); // Use toObject()

      return {
          courses: courses || [], // Ensure this is an array
          message: 'Fetching courses went successfully',
          success: true,
      };
  } catch (error) {
      console.error('Fetch all course error:', error);
      return { success: false, message: 'Failed to fetch courses. Please try again', courses: [] };
  }
}

async listCourse(data:courseId){
  try{

    const {courseId} = data
    console.log(courseId)
      const courseDetails=await Course.findOne({_id:courseId});
      console.log('courseDetails',courseDetails)

        if(!courseDetails){
          return { success: false, message: 'Course not found' };          
        }

        const isList = !courseDetails.isListed;

        await Course.updateOne({_id:courseId}, { $set: { isListed: isList } });
     
          return {courseId:courseId,message: isList ? "Successfully List the course" : "Successfully Unlist the course",success:true}
      
  }catch(error){
      console.log('fetch all course error',error);
      return { success: false, message: "Course fetch courses. Please try again" };
      
  }
}



async editCourse(courseData: any) {
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


async addCourseStudents(data: any) {
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



async userMyCourses(data:any) {
  try {

    console.log(data,"dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      // Check if data.myCourse is defined and is an array
      if (!data.courses || !Array.isArray(data.courses)) {
          console.log('myCourse is undefined or not an array');
          return {
              success: false,
              message: 'Invalid course data received.',
          };
      }

      // Extract courseId from the myCourse data
      const courseIds = data.courses.map((course: any) => course.courseId); // Specify type for course

      // Fetch courses using the courseIds and select required fields
      const courses = await Course.find(
          { _id: { $in: courseIds } },
          '_id courseName courseDescription thumbnail courseCategory courseLevel' // Specify fields to select
      );

      console.log('Fetched Courses:', courses);

      if (courses.length > 0) {
          return {
              courses: courses,
              message: 'Fetching courses was successful',
              success: true,
          };
      } else {
          return {
              message: 'No courses found for the user',
              success: false,
          };
      }
  } catch (error) {
      console.log('Fetch all courses error:', error);
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


async reportCourses(): Promise<ReportWithCourseData[] | { success: boolean; message: string }> {
  try {
      // Explicitly type the course reports
      const courseReports = await CourseReport.find({}).lean().exec() as ICourseReport[];

      if (!courseReports.length) {
          return { success: true, message: 'No course reports found.' };
      }

      // Extract course IDs and ensure they're ObjectIds
      const courseIds = courseReports.map(report => 
          new mongoose.Types.ObjectId(report.courseId)
      );

      // Fetch courses with `isListed` included
      const courses = await Course.find({ 
          _id: { $in: courseIds } 
      })
      .select('courseName thumbnail isListed')  // Include `isListed`
      .lean()
      .exec() as (Pick<ICourseDocument, '_id' | 'courseName' | 'thumbnail' | 'isListed'>)[];

      // Create a type-safe mapping
      const courseMap = new Map<string, { courseName: string; thumbnail: string; isListed: boolean }>();
      
      courses.forEach((course) => {
          const courseId = (course._id as mongoose.Types.ObjectId).toString(); // Assert `_id` type
          courseMap.set(courseId, {
              courseName: course.courseName,
              thumbnail: course.thumbnail,
              isListed: course.isListed
          });
      });

      // Map the reports with proper type safety, including `isListed`
      const reportsWithCourseData: ReportWithCourseData[] = courseReports.map(report => {
          const courseDetails = courseMap.get(report.courseId.toString());
          
          return {
              courseId: report.courseId.toString(),
              courseName: courseDetails?.courseName || 'Unknown Course',
              thumbnail: courseDetails?.thumbnail || 'default_thumbnail.jpg',
              isListed: courseDetails?.isListed ?? false,  // Default to `false` if `isListed` is not available
              userId: report.userId.toString(),
              username: report.username,
              email: report.email,
              reason: report.reason,
              description: report.description,
              createdAt: report.createdAt
          };
      });

      console.log(reportsWithCourseData,"final-----------------------")

      return reportsWithCourseData;

  } catch (error) {
      console.error('Error fetching course reports:', error);
      return { success: false, message: 'Error fetching course reports. Please try again.' };
  }
}



async  graphCourses(data: any) {
  try {
    // Assume `db` is your MongoDB database connection
    const updatedData = await Promise.all(
      data.map(async (item: { courseId: ObjectId, totalStudents: number }) => {
        // Fetch the course details by courseId
        const course = await Course.findOne({ _id: item.courseId });
        
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




}


