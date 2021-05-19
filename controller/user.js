const Role = require('../models/role');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const session = require('express-session')
const Attendance = require('../models/attendance');
const date = require('date-and-time');
const Leave = require('../models/leaves')
const { password } = require('../config')

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mansiqwerty01@gmail.com',
        pass: password
    }
});

module.exports.renderLogin = (req, res) => {
    res.render('login');
}

module.exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/signin')
}


module.exports.postlogin = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
        req.flash('error', "User doesn't exist")
        return res.status(422).redirect('/signin')
    }
    const match = await bcrypt.compare(password, user.password)

    if (match) {
        req.user = user
        req.session.user = user._id
        req.flash('success', "successfully signed in")
        res.status(200).redirect('/dashboard')
    }
    else {

        req.flash('error', "Invalid Id or Password")
        return res.status(422).redirect('/signin')

    }
}


module.exports.renderregister = async (req, res) => {
    const user = await User.findOne({ _id: req.session.user }).populate('manager role')
    const users = await User.find({}).populate('role')
    const managers = users.filter(user =>
        user.role.type === "Admin"
    )
    res.render('register', { managers, user });
}


module.exports.postregister = async (req, res) => {

    const password = Math.random().toString(36).slice(-8);
    let mailDetails = {
        from: 'mansiqwerty01@gmail.com',
        to: req.body.email,
        subject: 'HR-ONE signup Successful',
        text: 'I hope you have wonderful experience on this platform',
        html: `<h3>Congratulations on signup !<h3>
        <p> Here are your credentials for Hr-One login</p>
        <p>Password : ${password}</p>`
    };
    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
    const saveduser = await User.findOne({ email: req.body.email })
    if (saveduser) {
        req.flash('error', "User already exists")
        res.redirect('/signup')
    }
    const user = await User.findOne({ _id: req.session.user }).populate('role')
    const hpw = await bcrypt.hash(password, 15)
    req.body.password = hpw
    const manager = await User.findOne({ name: req.body.manager })
    req.body.manager = manager._id
    const role = await Role.findOne({ type: req.body.role })
    req.body.role = role._id
    const newuser = new User(req.body)
    await newuser.save()
    req.flash('success', "User created successfully")
    res.redirect('dashboard');
}

module.exports.dashboard = async (req, res) => {
    const userid = req.session.user
    const user = await User.findOne({ _id: userid }).populate('role manager')
    const now = new Date();
    const d = date.format(now, 'YYYY-MM-DD');
    const att = await Attendance.findOne({ userid: user._id, date: d })

    res.render('dashboard', { user, att });
}

module.exports.profile = async (req, res) => {
    const userid = req.session.user
    const users = await User.find({}).populate('role')
    const user = await (await User.findOne({ _id: userid }).populate('role manager'))
    const managers = users.filter(user =>
        user.role.type === "Admin"
    )
    console.log(user)
    res.render('profile', { user, managers });
}

module.exports.forgot = async (req, res) => {
    res.render('forgot')
}

module.exports.resetpassword = async (req, res) => {
    const email = req.body.email
    const user = await User.findOne({ email })
    const token = Math.random().toString(36).slice(-8);
    user.resettoken = token;
    user.expiretoken = Date.now() + 3600000
    const saveduser = await user.save()
    let mailDetails =
    {
        from: 'mansiqwerty01@gmail.com',
        to: user.email,
        subject: 'Reset Password',
        text: 'Here is the link to reset your password',
        html: `<h4>Click on this <a href="http://localhost:3000/newpassword/${token}">link</a> to reset password .</h4>`
    }

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
            req.flash('success', "Email sent successfully")
            res.redirect('/signin')
        }
    })
}

module.exports.edituser = async (req, res) => {
    console.log("data isss", req.body)
    res.redirect('/profile')
}


module.exports.rendernew = async (req, res) => {
    const token = req.params.token;
    res.render('newpassword', { token })
}


module.exports.users = async (req, res) => {
    const user = await User.findOne({ _id: req.session.user }).populate('role')
    const users = await User.find({}).populate('role manager')
    res.render('users', { users, user })
}

module.exports.newpassword = async (req, res) => {
    const newpassword = req.body.password
    const token = req.params.token;
    const user = await User.findOne({ resettoken: token, expiretoken: { $gt: Date.now() } })
    if (user) {
        const hpw = await bcrypt.hash(newpassword, 15)
        user.password = hpw;
        user.resettoken = ''
        user.expiretoken = ''
        await user.save()
        res.redirect('/signin')
    }
    else {
        res.json({ err: "Session expired" }).redirect('/login')
    }
}



module.exports.deluser = async (req, res) => {
    const id = req.body.id;
    console.log(id)
    const user = await User.findOne({ _id: id })
    await User.findByIdAndDelete(id);
    await Attendance.deleteMany({ userid: user._id })
    await Leave.deleteMany({ userid: user._id });
    res.redirect('users')
}