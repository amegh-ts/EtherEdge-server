const { verifyTokenAndAuthorization, verifyToken } = require("../VerifyToken");
const {
  viewProfile,
  editProfile,
  deleteProfile,
  allUsers,
} = require("../controller/UserController");

const router = require("express").Router();

// view profile
router.get(
  "/Viewprofile/:id",
  verifyToken,
  verifyTokenAndAuthorization,
  viewProfile
);
// edit profile
router.put(
  "/editprofile/:id",
  verifyToken,
  verifyTokenAndAuthorization,
  editProfile
);
// delete profile
router.delete(
  "/deleteProfile/:id",
  verifyToken,
  verifyTokenAndAuthorization,
  deleteProfile
);
// all users
router.get("/allusers", verifyToken, allUsers);

module.exports = router;
