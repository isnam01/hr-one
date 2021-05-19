const User = require('./models/user');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/signin');
    }
    next();
}



module.exports.isAdmin = async (req, res, next) => {
    const user = await User.findOne({ _id: req.session.user }).populate('role')
    if (user.role.type === 'Admin') {
        next();
    }
}
