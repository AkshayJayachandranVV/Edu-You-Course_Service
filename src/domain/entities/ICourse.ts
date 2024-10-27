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

  
  



export interface courseId {
    courseId: string;
  }


export interface MyCoursesResponse {
    courses: ICourse[];
    message: string;
    success: boolean;
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