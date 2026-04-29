import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["mbti", "holland", "disc", "custom"],
      required: true,
      default: "custom",
    },
    code: {
      type: String,
      trim: true,
      default: "",
    },
    summary: {
      type: String,
      trim: true,
      default: "",
    },
    scores: {
      type: Object,
      default: {},
    },
    careers: {
      type: [String],
      default: [],
    },
    rawAnswers: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
);

export const Assessment =
  mongoose.models.Assessment ||
  mongoose.model("Assessment", assessmentSchema, "assessments");
