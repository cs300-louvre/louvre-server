// const mongoose = require("mongoose");
import { Schema, model, connect, Types } from "mongoose";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

export type IUserSchema = {
  userId: string;
  name: string;
  email: string;
  thumbnailUrl: string;
  role: string;
  password: string;
  resetPasswordToken: string;
  expirePasswordToken: Date;
  resetPasswordDate: Date;
  createdAt: string;
};

const UserSchema = new Schema<IUserSchema>({
  userId: String,
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  thumbnailUrl: {
    type: String,
    default: "https://i.imgur.com/8Km9tLL.png",
  },
  role: {
    type: String,
    enum: ["user", "manager", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  expirePasswordToken: Date,
  resetPasswordDate: Date,
  createdAt: {
    type: String,
    default: Date.now().toString(),
  },
});

UserSchema.post("save", async function () {
  if (this.userId) {
    return;
  }

  this.userId = this._id.toString();
  this.save();
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Comparing input password with user password
UserSchema.methods.comparePassword = async function (inputPassword: string) {
  return await bcrypt.compare(inputPassword, this.password);
};

export default model<IUserSchema>("User", UserSchema);
