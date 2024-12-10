import mongoose, { Document, Schema } from "mongoose";
import { ICourse } from "../domain/entities/ICourse";

export interface ICourseDocument extends ICourse, Document {}

// Schema for lessons
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  video: {
    type: String,
    required: true,
  },
});

// Schema for sections containing lessons
const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  lessons: [lessonSchema], // Array of lessons
});

// Schema for students with ID and enrollment date
const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  enrolledDate: {
    type: Date,
    default: Date.now,
  },
});

// Main course schema
const courseSchema: Schema = new Schema({
  tutorId: {
    type: String,
    required: true,
  },
  courseName: {  // Changed from title to courseName
    type: String,
    required: true,
  },
  courseDescription: {  // Changed from description to courseDescription
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  coursePrice: {  // Changed from price to coursePrice
    type: Number,
    required: true,
  },
  courseDiscountPrice: {  // Changed from discountPrice to courseDiscountPrice
    type: Number,
  },
  courseCategory: {  // Changed from category to courseCategory
    type: String,
    required: true,
  },
  isListed: {
    type: Boolean,
    required: true,
  },
  adminIsListed: {
    type: Boolean,
    required: true,
  },
  courseLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  demoURL: {
    type: String,
  },
  prerequisites: [{
    type: String,
  }],
  benefits: [{
    type: String,
  }],
  sections: [sectionSchema], // Array of sections with lessons
  students: [studentSchema], // Array of students with id and enrollment date
}, {
  timestamps: true,
});

export const Course = mongoose.model<ICourseDocument>('Course', courseSchema);
