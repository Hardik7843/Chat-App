import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return typeof v == "string";
        },
        message: "Email must be a string!",
      }
    },
    fullName: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return typeof v == "string";
        },
        message: "Name must be a string!",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validate: {
        validator: function (v) {
          return typeof v == "string";
        },
        message: "Password must be a string!",
      }
    },
    profilePic: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          return typeof v == "string";
        },
        message: "Profile must be a string representing path",
      }
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;