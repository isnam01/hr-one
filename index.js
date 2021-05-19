const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejsmate = require('ejs-mate')
const path = require('path')
const User = require('./models/user');
const session = require('express-session')
const flash = require('connect-flash');
const userRoutes = require('./routes/user');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leave');
const Role = require('./models/role')
const methodOverride = require('method-override')
const { mongourl } = require('./config')

mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.on("open", () => {
    console.log("Database Connected")
});



app.use(express.urlencoded({ extended: true }))
app.engine('ejs', ejsmate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookies: {
        expires: Date.now() + 1000 * 60 * 60 * 60,
        maxAge: 1000 * 60 * 60 * 60
    }
}))
app.use(flash())

app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.locals.currentuser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    return next()
})

app.use('/', userRoutes);
app.use('/', attendanceRoutes);
app.use('/', leaveRoutes);


app.get('/demo', async (req, res) => {
    res.render('demo')
})


app.listen(3000, () =>
    console.log("Serving on port 3000")
)
