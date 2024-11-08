import {CourseService} from "../../application/use-case/course"
import {ReportData} from "../../domain/entities/ICourse";


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

    async useCourse(){
        try {
            
            console.log('in controlerrr');
            const result = await this.courseService.userCourse();
            console.log('got result from course.ts for addocourse');
         
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }


    async courseDetails(data:any){
        try {
            
            console.log('in controlerrr');
            const result = await this.courseService.courseDetails(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
        }
    }

    async allCourses(data:any){
        try {
            
            console.log('in controlerrr');
            const result = await this.courseService.allCourses();
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
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


    async userMyCourses(data: any){
        try {
            
            console.log(data,'in controlerrr');
            const result = await this.courseService.userMyCourses(data);
            console.log('got result from course.ts for addocourse');
            
            return result
        }catch(error){
            console.log('error in addcourse',error);
    
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



}

export const courseController = new CourseController()



