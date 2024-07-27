const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String, unique: true, required: true },
    dob: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    phone: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    image: { type: String },
    about: { type: String },
    lastLogin: { type: String },
  },
  { timestamps: true }
); //to add the date and time the value is added to DB or edited

module.exports = mongoose.model("users", UserSchema); //here 'users' is the name of the collection you are creating
