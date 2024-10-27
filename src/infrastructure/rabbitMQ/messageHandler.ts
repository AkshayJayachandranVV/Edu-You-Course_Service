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

            case 'course-details' :
                console.log('Handling operation',operations,data);
                response = await courseController.courseDetails(data)
                console.log("data reached ",response);
                break;
            case 'all-courses' :
                console.log('Handling operation',operations,data);
                response = await courseController.allCourses(data)
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

            case 'admin-courses' :
                console.log('Handling operation',operations,data);
                response = await courseController.allCourses(data)
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
        }

        

        await RabbitMQClient.produce(response,correlationId,replyTo)
     }
}

     