const express = require('express');
const router = express.Router();
const attendance = require('../controller/attendance');
const { isLoggedIn } = require('../middleware')
const { isAdmin } = require('../middleware')

router.route('/attendance')
    .get(isLoggedIn, attendance.renderattendance)
    .post(isLoggedIn, attendance.postattendance)
    .delete(isLoggedIn, attendance.delattendance)

router.route('/approval')
    .get(isLoggedIn, attendance.attendance)
    .post(isLoggedIn, attendance.approve)

router.route('/attreject')
    .post(isLoggedIn, attendance.reject)


router.route('/attendancecorrection')
    .post(isLoggedIn, attendance.correction)
    .delete(isLoggedIn, attendance.delattendance)
module.exports = router;