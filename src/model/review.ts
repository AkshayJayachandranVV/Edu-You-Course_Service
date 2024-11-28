import mongoose, { Schema, Document } from 'mongoose';
import { ICourseReview } from '../domain/entities/ICourse';


const CourseReviewSchema: Schema = new Schema({
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
  profilePicture: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

export const CourseReview = mongoose.model<ICourseReview>('CourseReview', CourseReviewSchema);
