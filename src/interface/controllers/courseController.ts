import {CourseService} from "../../application/use-case/course"
import {ReportData,ReviewData,courseId,ICourse,MyCourseFetchResponse,PaginationData,TutorPagination,UserCourse,MyCoursesRequest,
    GraphCourseInput,ICourseData
} from "../../domain/entities/ICourse";
import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import mongoose from "mongoose";
import * as grpc from '@grpc/grpc-js';


class CourseController {
    private courseService: CourseService

    constructor() {
        this.courseService = new CourseService()
    }

    async uploadCourse(data: ICourse){
        try {
            
            console.log(data,'in controlerrr');
            const result = await this.courseService.addCourse(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }

    async useCourse(): Promise<any> {
        try {
            console.log("Request received for useCourse");
    
            // Call the course service to fetch courses
            const result = await this.courseService.userCourse();
    
            console.log("Result received from courseService:", result);
    
            // Send the result back to the gRPC client
            return result
        } catch (error) {
            console.error("Error in useCourse:", error);
    
        }
    }
    


    async courseDetails(data:courseId) {
        try {
          console.log("in lalalal controller ------------");
      
          // Call the service method
          const result: any = await this.courseService.courseDetails(data);
      
          console.log(result,"Got result from course.ts for courseDetails");
      
          // Use the callback to send the response
          return result
        } catch (error) {
          console.error("Error in courseDetails:", error);
      
        }
      }



    async allCourses(data: PaginationData) {
        try {
            console.log("Request received for allCourses");
    
    
            // Call the course service to fetch all courses
            const result = await this.courseService.allCourses(data);
    
            // console.log("Result received from courseService:", result);
    
            // Send the result back to the gRPC client
            return result
        } catch (error) {
            console.error("Error in allCourses:", error);
    
            // Handle and return the error in the gRPC format
            
        }
    }
    


    async tutorMyCourses(data:TutorPagination){
        try {
            
            console.log('in controlerrr',data);
            const result = await this.courseService.tutorMyCourses(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }


    async listCourses(data:TutorPagination){
        try {
            
            console.log('in controlerrr',data);
            const result = await this.courseService.listCourse(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }


    async courseDataEdit(data:courseId){
        try {
            
            console.log('in controlerrr',data);
            const result = await this.courseService.courseDataEdit(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }



    async editCourse(data: ICourseData){
        try {
            
            console.log(data,'in controlerrr');
            const result = await this.courseService.editCourse(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }


    async addCourseStudents(data: UserCourse){
        try {
            
            console.log(data,'in controlerrr');
            const result = await this.courseService.addCourseStudents(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }


    async fetchMyCourseData(data: mongoose.Schema.Types.ObjectId[]){
        try {
            
            console.log(data,'in controlerrr');
            const result = await this.courseService.fetchMyCourseData(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }


    // gRPC handler function for userMyCourses
    async userMyCourses(data:MyCoursesRequest) {
        try {
          
          console.log(data, 'in controller');
      
          // Assuming courseService.userMyCourses returns a list of courses or an empty array
          const result = await this.courseService.userMyCourses(data);
      
          // Ensure that the 'courses' field is always an array (even if empty)
          const response: MyCourseFetchResponse = {
            success: result.success,
            courses: result.courses || []  // If result.courses is undefined, use an empty array
          };
      
          console.log('Got result from course.ts for userMyCourses');
          
          // Return the result to the gRPC client
          return response
        } catch (error) {
          console.log('Error in userMyCourses:', error);
        }
      }
      
  


    async courseViewDetails(data:{courseId:string}){
        try {
            
            console.log(data,'in controlerrr');
            const result = await this.courseService.courseViewDetails(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }


    async report(data:ReportData){
        try {
            
            console.log(data,'in controlerrr');
            const result = await this.courseService.report(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }



    async reportCourses(){
        try {
            
            const result = await this.courseService.reportCourses();
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }


    async graphCourses(data:GraphCourseInput[]){
        try {
            
            const result = await this.courseService.graphCourses(data);
            console.log('got result from course.ts for graph courses');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }


    async notifyCourseData(data:{roomId:string}){
        try {
            
            const result = await this.courseService.notifyCourseData(data);
            console.log('got result from course.ts for graph courses');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }


    async storeReview(data:ReviewData){
        try {
            
            const result = await this.courseService.storeReview(data);
            console.log('got result from course.ts for graph courses');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }


    async fetchReview(data:courseId){
        try {
            
            const result = await this.courseService.fetchReview(data);
            console.log('got result from course.ts for graph courses');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }



    async TotalCourses(){
        try {
            
            const result = await this.courseService.TotalCourses();
            console.log('got result from course.ts for graph courses');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }



}

export const courseController = new CourseController()



