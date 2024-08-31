import mongoose, { Document, Query } from "mongoose";
import crypto from "crypto";
import validator from "validator";
import bcrypt from "bcryptjs";

export enum Roles {
  User = "user",
  Driver = "driver",
  Admin = "admin",
}

export interface IUserDocument extends Document {
  name: string;
  email: string;
  photo?: string;
  role: Roles;
  password: string | undefined;
  passwordConfirm: string | undefined;
  passwordChangedAt?: Date | number;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active?: boolean;
  correctPassword(
    candidatePassword: string,
    userPassword: string | undefined
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimeStamp: number): boolean;
  createPasswordResetToken(): string;
}

type TUserQuery = Query<IUserDocument, IUserDocument>;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name."],
  },

  email: {
    type: String,
    required: [true, "Please enter your email."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email."],
  },

  photo: String,

  role: {
    type: String,
    enum: [Roles.User, Roles.Driver, Roles.Admin],
    default: "user",
  },

  password: {
    type: String,
    required: [true, "Please enter your password."],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "Re-enter your password."],
  },

  passwordChangedAt: Date,

  passwordResetToken: String,

  passwordResetExpires: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre<IUserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  }

  next();
});

userSchema.pre<IUserDocument>("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre<TUserQuery>(/^find/, function (next) {
  this.where({ active: { $ne: false } });

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp: number) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = this.passwordChangedAt.getTime() / 1000;
    10;

    console.log(changedTimeStamp, JWTTimeStamp);

    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp: number) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = (this.passwordChangedAt.getTime() / 1000, 10);

    console.log(changedTimeStamp, JWTTimeStamp);

    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;
