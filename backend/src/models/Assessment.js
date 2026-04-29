import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
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

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
    riasecScores: {
      type: new mongoose.Schema(
        {
          R: { type: Number, default: 0 },
          I: { type: Number, default: 0 },
          A: { type: Number, default: 0 },
          S: { type: Number, default: 0 },
          E: { type: Number, default: 0 },
          C: { type: Number, default: 0 },
        },
        { _id: false },
      ),
      required: true,
    },
    dominantType: {
      type: String,
      required: true,
      trim: true,
    },
    suggestedCareers: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false },
);

export const Assessment =
  mongoose.models.Assessment ||
  mongoose.model("Assessment", assessmentSchema, "assessments");
