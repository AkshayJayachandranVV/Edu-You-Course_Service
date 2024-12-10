import {courseController} from '../../interface/controllers/courseController';
import RabbitMQClient from './client';


export default class MessageHandlers{
     static async handle(operations:string,data : any, correlationId:string,replyTo:string){
        let response
        switch(operations){
            case 'upload-course' :
                console.log('Handling operation',operations,data);
                response = await courseController.uploadCourse(data)
                console.log("data reached ",response);
                break;

            case 'user-course' :
                console.log('Handling operation',operations,data);
                response = await courseController.useCourse()
                console.log("data reached ",response);
                break;

            case 'all-courses' :
                console.log('Handling operation',operations,data);
                response = await courseController.allCourses(data)
                console.log("data reached ",response);
                break;

            case 'course-details' :
                console.log('Handling operation',operations,data);
                response = await courseController.courseDetails(data)
                console.log("data reached ",response);
                break;
            case 'tutor-courses' :
                console.log('Handling operation',operations,data);
                response = await courseController.tutorMyCourses(data)
                console.log("data reached ",response);
                break;
            case 'tutor-courses-list' :
                console.log('Handling operation',operations,data);
                response = await courseController.listCourses(data)
                console.log("data reached ",response);
                break;
            case 'tutor-edit-course' :
                console.log('Handling operation',operations,data);
                response = await courseController.courseDataEdit(data)
                console.log("data reached ",response);
                break;

            case 'edit-course' :
                console.log('Handling operation',operations,data);
                response = await courseController.editCourse(data)
                console.log("data reached ",response);
                break;

            case 'admin-courses-list' :
                console.log('Handling operation',operations,data);
                response = await courseController.listCourses(data)
                console.log("data reached ",response);
                break;

            case 'update-course-students' :
                console.log('Handling operation',operations,data);
                response = await courseController.addCourseStudents(data)
                console.log("data reached ",response);
                break;
            case 'fetch-course-myCourse' :
                console.log('Handling operation',operations,data);
                response = await courseController.fetchMyCourseData(data)
                console.log("data reached ",response);
                break;
            case 'course-view-details' :
                console.log('Handling operation',operations,data);
                response = await courseController.courseViewDetails(data)
                console.log("data reached ",response);
                break;
            case 'report-course' :
                console.log('Handling operation',operations,data);
                response = await courseController.report(data)
                console.log("data reached ",response);
                break;
            case 'admin-report-courses' :
                console.log('Handling operation',operations,data);
                response = await courseController.reportCourses()
                console.log("data reached ",response);
                break; 
            case 'tutor-fetch-graphCourses' :
                console.log('Handling operation',operations,data);
                response = await courseController.graphCourses(data)
                console.log("data reached ",response);
                break;     
            case 'notify-course-data' :
                console.log('Handling operation',operations,data);
                response = await courseController.notifyCourseData(data)
                console.log("data reached ",response);
                break;  
            case 'store-review' :
                console.log('Handling operation',operations,data);
                response = await courseController.storeReview(data)
                console.log("data reached ",response);
                break;  
            case 'fetch-review' :
                console.log('Handling operation',operations,data);
                response = await courseController.fetchReview(data)
                console.log("data reached ",response);
                break; 
            case 'admin-total-courses' :
                console.log('Handling operation',operations,data);
                response = await courseController.TotalCourses()
                console.log("data reached ",response);
                break;
            case 'fetch-user-myCourse' :
                console.log('Handling operation',operations,data);
                response = await courseController.userMyCourses(data)
                console.log("data reached ",response);
                break;
            case 'list-unlist-course' :
                console.log('Handling operation',operations,data);
                response = await courseController.listUnlist(data)
                console.log("data reached ",response);
                break; 
        }

        

        await RabbitMQClient.produce(response,correlationId,replyTo)
     }
}

     

