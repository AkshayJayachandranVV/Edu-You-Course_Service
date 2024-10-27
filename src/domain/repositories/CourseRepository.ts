import { Course } from "../../model/course";
import { ICourse,courseId,MyCoursesResponse,Ilesson,ISections} from "../entities/ICourse";
import { ICourseRepository} from "./ICourseRepository";
import mongoose from "mongoose";



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



  
}


