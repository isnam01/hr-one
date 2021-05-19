const express = require('express');
const router = express.Router();
const users = require('../controller/user');
const { isLoggedIn } = require('../middleware')
const { isAdmin } = require('../middleware')

router.route('/signin')
    .get(users.renderLogin)
    .post(users.postlogin)


router.route('/signup')
    .get(isLoggedIn, isAdmin, users.renderregister)
    .post(isLoggedIn, isAdmin, users.postregister)
    .put(isLoggedIn, users.edituser)

router.route('/deluser')
    .delete(isLoggedIn, isAdmin, users.deluser)

router.route('/users')
    .get(isLoggedIn, users.users)

router.route('/dashboard')
    .get(isLoggedIn, users.dashboard)


router.route('/profile')
    .get(isLoggedIn, users.profile)


router.route('/logout')
    .get(isLoggedIn, users.logout)


router.route('/forgot')
    .get(users.forgot)
    .post(users.resetpassword)


router.route('/newpassword/:token')
    .get(users.rendernew)
    .post(users.newpassword)



module.exports = router;