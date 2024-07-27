const { verifyTokenAndAuthorization, verifyToken } = require('../VerifyToken')
const { signUp, signIn, viewProfile, editProfile, deleteProfile, allUsers } = require('../controller/UserController')

const router = require('express').Router()

// signup
router.post('/signup', signUp)
//signin
router.post('/signin', signIn)
// view profile
router.get('/Viewprofile/:id', verifyToken, verifyTokenAndAuthorization, viewProfile)
// edit profile
router.put('/editprofile/:id', verifyToken, verifyTokenAndAuthorization, editProfile)
// delete profile
router.delete('/deleteprofile/:id', verifyToken, verifyTokenAndAuthorization, deleteProfile)
// all users
router.get('/allusers', verifyToken, allUsers)


module.exports = router