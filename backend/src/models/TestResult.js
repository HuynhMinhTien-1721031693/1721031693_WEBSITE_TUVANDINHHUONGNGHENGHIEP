import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    topTrait: {
      type: String,
      required: true,
      trim: true,
    },
    topLabel: {
      type: String,
      required: true,
      trim: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    scores: {
      type: Object,
      required: true,
    },
    careers: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export const TestResult =
  mongoose.models.TestResult ||
  mongoose.model("TestResult", testResultSchema, "test_results");
