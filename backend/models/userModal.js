import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      // lowercase: true,   // to make it case insensitive
      // trim: true         // removes any extra spaces
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Saves createdAt and updatedAt as dates (default=false)
  }
);

userSchema.pre("save", async function save(next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
