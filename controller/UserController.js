const userController = require("../models/UserSchema");
const Crypto = require("crypto-js");
const Jwt = require("jsonwebtoken");

// Set inactive state for users who haven't logged in for 3 days
const setUserState = async () => {
  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const inactiveUsers = await userController.updateMany(
      { state: "active", lastLogin: { $lt: threeDaysAgo } },
      { $set: { state: "inactive" } },
      { new: true }
    );
    console.log(
      `${inactiveUsers.nModified} user(s) updated to inactive state.`
    );
  } catch (error) {
    console.error("Error updating user states:", error);
  }
};

setInterval(setUserState, 60 * 60 * 1000);

// Signup
const signUp = async (req, res) => {
  req.body.password = Crypto.AES.encrypt(
    req.body.password,
    process.env.Crypto_js
  ).toString();
  req.body.type = "user";
  req.body.lastLogin = Date.now();

  try {
    const existingUser = await userController.findOne({
      email: req.body.email,
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Username already exists",
        message:
          "The email address is already in use. Please try a different one.",
      });
    }

    const newUser = new userController(req.body);
    const savedUser = await newUser.save();
    res.status(200).json({
      success: true,
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message:
        "An error occurred while processing your request. Please try again later.",
    });
  }
};

// Signin
const signIn = async (req, res) => {
  try {
    const DB = await userController.findOne({ email: req.body.email });
    if (!DB) {
      return res.status(401).json({
        success: false,
        response: "Please check your email.",
      });
    }

    if (DB.state === "inactive") {
      await userController.findByIdAndUpdate(
        DB._id,
        { $set: { state: "active" } },
        { new: true }
      );
    }

    const hashedPassword = Crypto.AES.decrypt(
      DB.password,
      process.env.Crypto_js
    );
    const originalPassword = hashedPassword.toString(Crypto.enc.Utf8);
    if (originalPassword !== req.body.password) {
      return res.status(401).json({
        success: false,
        response: "Password and email don't match.",
      });
    }

    await userController.findByIdAndUpdate(DB._id, {
      $set: { lastLogin: Date.now() },
    });

    const accessToken = Jwt.sign(
      { id: DB._id, type: DB.type },
      process.env.Jwt_Key,
      {
        expiresIn: "1d",
      }
    );
    const { password, ...others } = DB._doc;
    res.status(200).json({
      success: true,
      message: "Signin successful",
      type: others.type,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message:
        "An error occurred while processing your request. Please try again later.",
    });
  }
};

// View profile
const viewProfile = async (req, res) => {
  try {
    const id = await userController.findById(req.user.id);
    const hashedPassword = Crypto.AES.decrypt(
      id.password,
      process.env.Crypto_js
    );
    const originalPassword = hashedPassword.toString(Crypto.enc.Utf8);
    const { password, ...others } = id._doc;
    res.status(200).json({
      success: true,
      user: { ...others, originalPassword },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message:
        "An error occurred while fetching the profile. Please try again later.",
    });
  }
};

// edit profile image
const editProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = req.file.path;

    // Update user's profile image URL in the database
    const updatedUser = await userController.findByIdAndUpdate(
      req.user.id,
      { profileImage: imageUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile image updated successfully",
      profileImage: imageUrl,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit profile
const editProfile = async (req, res) => {
  try {
    const updateData = await userController.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    );

    if (!updateData) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }
    res.status(200).json({
      message: "Profile updated successfully",
      user: updateData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message:
        "An error occurred while updating the profile. Please try again later.",
    });
  }
};

// Delete profile
const deleteProfile = async (req, res) => {
  try {
    const deleteData = await userController.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
      user: deleteData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message:
        "An error occurred while deleting the profile. Please try again later.",
    });
  }
};

// Get all users
const allUsers = async (req, res) => {
  if (req.user.type !== "admin") {
    return res.status(403).json({
      success: false,
      error: "You are not authorized to perform this action.",
    });
  }
  try {
    const data = await userController.find();
    res.status(200).json({
      success: true,
      users: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message:
        "An error occurred while fetching users. Please try again later.",
    });
  }
};

module.exports = {
  signUp,
  signIn,
  viewProfile,
  editProfileImage,
  editProfile,
  deleteProfile,
  allUsers,
};
