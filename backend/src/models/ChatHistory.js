import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    careerSuggestions: {
      type: [String],
      default: [],
    },
    learningRoadmap: {
      type: [String],
      default: [],
    },
    salaryReference: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export const ChatHistory =
  mongoose.models.ChatHistory ||
  mongoose.model("ChatHistory", chatHistorySchema, "chat_histories");
