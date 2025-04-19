import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows accounts without googleId
  },
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  program:
  {
    required: true,
    type: String,
  },
  branch:{
    required: true,
    type: String,
  },
  batch:{
    type: String,
    required: true,
  }, 
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Password is required only if no Google login
    },
  },
  profilePicture: {
    type: String,
    default: "",
  },
  coverPhoto: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  skills: {
    type: Array,
  },
  experience: [
    {
      title: String,
      company: String,
      startDate: Date,
      endDate: Date,
      description: String,
    },
  ],
  project: [
    {
      title: String,
      startDate: Date,
      endDate: Date,
      description: String,
    },
  ],
  education: [
    {
      instituteName: String,
      fieldOfStudy: String,
      startYear: Number,
      endYear: Number,
    },
  ],
  role: {
    type: String,
    required: true,
  },
  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  jobsApplied: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
    },
  ],
});

// Ensure the password isn't saved for Google users
userSchema.pre("save", function (next) {
  if (this.googleId) {
    this.password = undefined;
  }
  next();
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
