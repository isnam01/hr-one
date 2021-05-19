
const User = require('../models/user');
const Attendance = require('../models/attendance');
const date = require('date-and-time');
const Leave = require('../models/leaves')



module.exports.postattendance = async (req, res) => {

    const userid = req.session.user
    const user = await User.findOne({ _id: userid })
    const now = new Date();
    d = date.format(now, 'YYYY-MM-DD');
    const att = await Attendance.findOne({ date: d, userid, iscorrection: false })
    if (att) {
        att.checkout = date.format(now, 'hh:mm')
        if (user.manager == userid) {
            att.status = 'Approved'
        }
        await att.save()
    }
    else {
        const att = new Attendance({
            date: d,
            checkin: date.format(now, 'hh:mm'),
            userid: userid,
            manager: user.manager,

        })
        if (user.manager == userid) {
            att.status = 'Approved'
        }
        await att.save()

    }
    res.redirect('/dashboard')
}

module.exports.renderattendance = async (req, res) => {
    const user = await User.findOne({ _id: req.session.user }).populate('manager role')
    const attendance = await Attendance.find({ userid: user._id, iscorrection: false }).populate('manager userid')
    const attendancecorrection = await Attendance.find({ userid: user._id, iscorrection: true }).populate('userid')

    res.render('attendance', { attendance, user, attendancecorrection })
}



module.exports.delattendance = async (req, res) => {
    const id = req.body.id;

    await Attendance.findByIdAndDelete(id);
    res.redirect('attendance')
}

module.exports.attendance = async (req, res) => {
    const user = await User.findOne({ _id: req.session.user }).populate('manager role')
    if (user.role.type == 'Admin') {
        var attendances = await Attendance.find({ iscorrection: false }).populate('userid')
        var attendancecorrection = await Attendance.find({ iscorrection: true }).populate('userid')
    }
    else {
        var attendancecorrection = await Attendance.find({ manager: req.session.user, iscorrection: true }).populate('userid')
        var attendances = await Attendance.find({ manager: req.session.user, iscorrection: false }).populate('userid')
    }
    const leaves = await Leave.find({ manager: req.session.user }).populate('userid')
    res.render('approval', { attendances, user, leaves, attendancecorrection })
}

module.exports.approve = async (req, res) => {
    const id = req.body.id
    const userid = req.session.user
    const user = await User.findOne({ _id: userid }).populate('role')

    const attendance = await Attendance.findOne({ _id: id })

    if ((attendance.manager == userid) || user.role.type == 'Admin') {
        attendance.status = 'Approved';

        await attendance.save()
        res.redirect('approval')
    }

}

module.exports.reject = async (req, res) => {
    const id = req.body.id
    const userid = req.session.user
    const user = await User.findOne({ _id: userid }).populate('role')
    const attendance = await Attendance.findOne({ _id: id })

    if ((attendance.manager == userid) || user.role.type == 'Admin') {
        attendance.status = 'Rejected';
        await attendance.save()

        res.redirect('approval')
    }

}


module.exports.correction = async (req, res) => {
    const user = await User.findOne({ _id: req.session.user }).populate('manager role')
    const att = new Attendance({
        date: req.body.date,
        checkin: req.body.checkin,
        checkout: req.body.checkout,
        userid: user._id,
        manager: user.manager,
        iscorrection: true
    })
    if (user.manager == user._id) {
        att.status = 'Approved'
    }

    await att.save()
    res.redirect('attendance')
}
