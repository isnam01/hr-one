const express = require('express');
const router = express.Router();
const leaves = require('../controller/leaves');
const { isLoggedIn, isAdmin } = require('../middleware')


router.route('/leave')
    .get(isLoggedIn, leaves.getLeaves)
    .post(isLoggedIn, leaves.postLeaves)
    .delete(isLoggedIn, leaves.delLeaves)

router.route('/approve')
    .post(isLoggedIn, isAdmin, leaves.approve)

router.route('/reject')
    .post(isLoggedIn, isAdmin, leaves.reject)
module.exports = router;