import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAssessmentAnswer {
  questionId: string;
  value: number;
}

export interface IAssessmentResult {
  type: string;
  scores: Record<string, number>;
  suggestedCareers: string[];
}

export interface IAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  answers: IAssessmentAnswer[];
  result: IAssessmentResult;
  createdAt: Date;
}

const assessmentAnswerSchema = new Schema<IAssessmentAnswer>(
  {
    questionId: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { _id: false },
);

const assessmentSchema = new Schema<IAssessment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  answers: {
    type: [assessmentAnswerSchema],
    default: [],
  },
  result: {
    type: new Schema<IAssessmentResult>(
      {
        type: { type: String, required: true, default: "RIASEC" },
        scores: { type: Schema.Types.Mixed, default: {} },
        suggestedCareers: { type: [String], default: [] },
      },
      { _id: false },
    ),
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Assessment: Model<IAssessment> =
  (mongoose.models.Assessment as Model<IAssessment>) ||
  mongoose.model<IAssessment>("Assessment", assessmentSchema, "assessments");

export default Assessment;
