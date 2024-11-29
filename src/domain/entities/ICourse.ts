import mongoose from "mongoose";



export interface MyCourse {
  courseId: string;
}

export interface MyCoursesRequest {
  success: boolean;
  courses: MyCourse[];
}

export interface MyCourseFetchResponse {
  success: boolean;
  courses: MyCourse[]; 
}



export interface ISections{
    title:string;
    description:string;
    lessons:Ilesson[]
}


export interface Ilesson{
    title:string;
    description:string;
    video:string;
    displayVideo?: string; 
}


export interface ICourse extends Document { // Extend Document here
    tutorId: string;
    courseId?: string;
    courseName: string;
    courseDescription: string;
    coursePrice: number; 
    courseDiscountPrice: number; 
    courseCategory: string;
    courseLevel: string;
    demoURL: string;
    thumbnail: string;
    thumbnailKey?:string;
    prerequisites: string[];
    benefits: string[];
    sections: ISections[];
    isListed: boolean;
    createdAt:Date
}

export interface ICourseData {
    averageRating?: number;
    tutorId: string;
    courseName: string;  // Add this property
    courseDescription: string;  // Add this property
    coursePrice: number;  // Add this property
    courseDiscountPrice?: number;  // Optional field
    courseCategory: string;  // Add this property
    courseLevel: string;  // Add this property
    demoURL: string;
    thumbnail: string;
    thumbnailUrl?: string;  // If you need to store this too
    prerequisites: string[];
    benefits: string[];
    sections: ISections[];  // Ensure ISections is correctly defined
    createdAt?: string;  // Optional field
    updatedAt?: string;  // Optional field
    isListed: boolean;
}


// Define the structure of the report with course data
export interface ReportWithCourseData {
  courseId: string; // ObjectId of the course
  courseName: string;
  thumbnail: string;
  userId: string; // User ID who reported the course
  username: string; // Username of the reporter
  email: string; // Email of the reporter
  reason: string; // Reason for reporting
  description: string; // Description of the issue
  createdAt: Date; // Date of the report
}


export interface ICourseReport extends Document {
    courseId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    username: string;
    email: string;
    reason: string;
    description: string;
    createdAt: Date;
  }


export interface ICourseReview extends Document {
    courseId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    username: string;
    profilePicture?: string;
    rating: number;
    reviewText: string;
    createdAt: Date;
  }

  

export interface courseId {
    courseId: string;
  }


export interface MyCoursesResponse {
    courses: ICourse[];
    message: string;
    success: boolean;
  }


export interface MyCourse {
    courses:[
     courseId: string
    ]
}


  export interface courseData extends Document {
    title: string;
    thumbnail: string;
    price: number;
    discountPrice: number;
    category: string;
    level: string;
    createdAt: Date;
    isListed?: boolean;
}


export interface ReportData {
    courseId: string | undefined;
    userId: string;
    username: string;
    email: string;
    reason: string;
    description: string;
  }
  

export interface ReviewData {
  courseId: string;
  rating: number;
  reviewText: string;
  id: string;
  username: string;
  profilePicture: string;
}


export interface CourseResponse {
  message: string;
  success: boolean;
  courses: Course[];
}

export interface Course {
  _id: string;
  tutorId: string;
  courseName: string;
  courseDescription: string;
  thumbnail: string;
  coursePrice: number;
  courseDiscountPrice: number;
  courseCategory: string;
  isListed: boolean;
  courseLevel: string;
  demoURL: string;
  prerequisites: string[];
  benefits: string[];
  sections: Section[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  students: string[];
}

export interface Section {
  title: string;
  content: string;
}



export interface CourseDetailRequest {
  courseId: string;
}

export interface CourseResponse {
  message: string;
  success: boolean;
  courses: Course[];
  totalCount: number;
}

export interface Course {
  _id: string;
  tutorId: string;
  courseName: string;
  courseDescription: string;
  thumbnail: string;
  coursePrice: number;
  courseDiscountPrice: number;
  courseCategory: string;
  isListed: boolean;
  courseLevel: string;
  demoURL: string;
  prerequisites: string[];
  benefits: string[];
  sections: Section[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  students: string[];
}

export interface Section {
  title: string;
  content: string;
}