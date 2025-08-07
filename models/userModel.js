import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:"data:image/png;base64,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"
    },
    address: {
      type: Object,
      default:{line1:' ',line2:' '}
    },
    gender:{
      type:String,
      default:"Not Selected"
    },
    dob:{
      type:String,
      default:'Not Selected'
    },
    phone:{
      type:String,
      default:'00000000'
    }
  },
  { minimize: false }
);

const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;

