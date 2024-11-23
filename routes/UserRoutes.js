const { verifyTokenAndAuthorization, verifyToken } = require("../VerifyToken");
const {
  viewProfile,
  editProfile,
  deleteProfile,
  allUsers,
  editProfileImage,
} = require("../controller/UserController");
const { upload } = require("../utils/cloudinary");

const router = require("express").Router();

// view profile
router.get("/Viewprofile", verifyToken, viewProfile);
// edit profile image
router.put(
  "/update-profile-image",
  verifyToken,
  upload.single("profileImage"),
  editProfileImage
);
// edit profile
router.put("/editprofile", verifyToken, editProfile);
// delete profile
router.delete("/deleteProfile/:id", verifyToken, deleteProfile);
// all users
router.get("/allusers", verifyToken, allUsers);

module.exports = router;
