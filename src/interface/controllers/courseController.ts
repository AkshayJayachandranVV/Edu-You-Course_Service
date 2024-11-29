import {CourseService} from "../../application/use-case/course"
import {ReportData,ReviewData,courseId,MyCoursesRequest,MyCourseFetchResponse} from "../../domain/entities/ICourse";
import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import * as grpc from '@grpc/grpc-js';


class CourseController {
    private courseService: CourseService

    constructor() {
        this.courseService = new CourseService()
    }

    async uploadCourse(data: any){
        try {
            
            console.log(data,'in controlerrr');
            const result = await this.courseService.addCourse(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }

    async useCourse(call: any, callback: any): Promise<void> {
        try {
            console.log("Request received for useCourse");
    
            // Call the course service to fetch courses
            const result = await this.courseService.userCourse();
    
            console.log("Result received from courseService:", result);
    
            // Send the result back to the gRPC client
            return callback(null, result);
        } catch (error) {
            console.error("Error in useCourse:", error);
    
            // Handle and return the error in the gRPC format
            return callback({
                code: grpc.status.INTERNAL,
                message: error instanceof Error ? error.message : "Unknown error occurred",
            });
        }
    }
    


    async courseDetails(call: any,callback: any) {
        try {
          console.log("in lalalal controller ------------",call.request);
      
          const data = call.request; 
      
          // Call the service method
          const result: any = await this.courseService.courseDetails(data);
      
          console.log(result,"Got result from course.ts for courseDetails");
      
          // Use the callback to send the response
          return callback(null, result);
        } catch (error) {
          console.error("Error in courseDetails:", error);
      
          // Send an error response using the callback
          return callback({
            code: 13, // Internal server error code
            message: "Failed to fetch course details. Please try again later.",
          } as any);
        }
      }



    async allCourses(call: any, callback: any): Promise<void> {
        try {
            console.log("Request received for allCourses");

            const data = call.request;
    
    
            // Call the course service to fetch all courses
            const result = await this.courseService.allCourses(data);
    
            // console.log("Result received from courseService:", result);
    
            // Send the result back to the gRPC client
            return callback(null, result);
        } catch (error) {
            // console.error("Error in allCourses:", error);
    
            // Handle and return the error in the gRPC format
            return callback({
                code: grpc.status.INTERNAL,
                message: error instanceof Error ? error.message : "Unknown error occurred",
            });
        }
    }
    


    async tutorMyCourses(data:any){
        try {
            
            console.log('in controlerrr',data);
            const result = await this.courseService.tutorMyCourses(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }


    async listCourses(data:any){
        try {
            
            console.log('in controlerrr',data);
            const result = await this.courseService.listCourse(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }


    async courseDataEdit(data:any){
        try {
            
            console.log('in controlerrr',data);
            const result = await this.courseService.courseDataEdit(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }



    async editCourse(data: any){
        try {
            
            console.log(data,'in controlerrr');
            const result = await this.courseService.editCourse(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }


    async addCourseStudents(data: any){
        try {
            
            console.log(data,'in controlerrr');
            const result = await this.courseService.addCourseStudents(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }


    async fetchMyCourseData(data: any){
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
    async userMyCourses(call: { request: MyCoursesRequest }, callback: (error: any, response: MyCourseFetchResponse) => void) {
        try {
          const data: MyCoursesRequest = call.request; // The incoming request data
          
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
          callback(null, response);
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


    async graphCourses(data:any){
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



