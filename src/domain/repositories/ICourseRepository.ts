import {ICourse} from '../entities/ICourse'
// ICourseRepository.ts
export interface ICourseRepository {
  saveCourse(courseData: ICourse): Promise<{ success: boolean; message: string }>; // Modify return type
  // Other method declarations
}

  