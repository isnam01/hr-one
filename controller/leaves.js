const User = require('../models/user');
const Leave = require('../models/leaves')
const date = require('date-and-time');



module.exports.getLeaves = async (req, res) => {
    const leaves = await Leave.find({ userid: req.session.user }).populate('manager userid')
    const user = await User.findOne({ _id: req.session.user }).populate('manager role')
    res.render('leave', { leaves, user })
}

module.exports.postLeaves = async (req, res) => {
    const { start, end, reason, type } = req.body
    const now = new Date();

    const days = date.subtract(date.parse(end, 'YYYY-MM-DD'), date.parse(start, 'YYYY-MM-DD')).toDays() + 1;
    const user = await User.findOne({ _id: req.session.user }).populate('manager role')

    if (type === 'birthday' && !(days <= 1 - user.leave.birthday)) {

        req.flash('error', "Cannot take that much leaves")
        return res.status(422).redirect('/leave')
    }

    else if (type === 'normal' && !(days <= 5 - user.leave.normal)) {

        req.flash('error', "Cannot take that much leaves")
        return res.status(422).redirect('/leave')
    }
    const leave = new Leave({
        start,
        end,
        reason,
        manager: user.manager._id,
        userid: user._id,
        requestdate: date.format(now, 'DD/MM/YYYY'),
        days,
        type
    })
    await user.save()

    await leave.save()

    res.redirect('leave')
}

module.exports.delLeaves = async (req, res) => {
    const id = req.body.id;
    await Leave.findByIdAndDelete(id);

    res.redirect('leave')
}

module.exports.approve = async (req, res) => {
    const id = req.body.id
    console.log(id)
    const userid = req.session.user
    const user = await User.findOne({ _id: userid }).populate('role')

    const leave = await Leave.findOne({ _id: id }).populate('userid')
    const leaveuser = await User.findOne({ _id: leave.userid })
    if ((leave.manager == userid) || user.role.type == 'Admin') {

        if (leave.type === 'birthday') {

            leaveuser.leave.birthday = 1
            leave.status = 'Approved';
        }

        else if (leave.type === 'normal') {
            leaveuser.leave.normal = leave.userid.leave.normal + leave.days
            leave.status = 'Approved';
        }
        else if (leave.type === 'extra') {
            leaveuser.leave.extra = +leave.days
            leave.status = 'Approved';
        }
        console.log("leave is ", leave)
        await leaveuser.save()
        await leave.save()
        res.redirect('/approval')
    }

}

module.exports.reject = async (req, res) => {
    const id = req.body.id
    const userid = req.session.user
    const user = await User.findOne({ _id: userid }).populate('role')
    const leave = await Leave.findOne({ _id: id }).populate('userid')

    if ((leave.manager._id === userid) || user.role.type === 'Admin') {
        leave.status = 'Rejected';
        await leave.save()

        res.redirect('approval')
    }

}