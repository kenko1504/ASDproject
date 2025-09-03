import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  stepNumbers: [
    {
      type: Number,
      ref: "StepNumber",
    },
  ],
  instructions: { type: [String], required: true },
});

const Step = mongoose.model("Step", stepSchema);

export default Step;
