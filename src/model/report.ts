import mongoose, { Schema, Document } from 'mongoose';
import {ICourseReport} from '../domain/entities/ICourse'


const CourseReportSchema: Schema = new Schema({
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true,
      enum: ['Inappropriate content', 'Spam', 'Misleading information', 'Other'] // Define acceptable reasons here
    },
    description: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true
    }
  });
  
export const CourseReport = mongoose.model<ICourseReport>('CourseReport', CourseReportSchema);