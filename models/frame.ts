import mongoose, {Schema} from "mongoose";

const frameSchema = new Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    command: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Frame = mongoose.models.Frame || mongoose.model("Frame", frameSchema);
export default Frame;
