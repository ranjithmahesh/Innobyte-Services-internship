import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String, default: "" },
    mobile: { type: Number, default: "" },

    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
