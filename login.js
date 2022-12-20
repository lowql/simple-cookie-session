const express = require("express");
const session = require('express-session')
const bodyParser = require('body-parser')
const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded(
    { extended: false }
));
app.use(session({
    secret: 'mySecret',
    name: 'user', // optional
    saveUninitialized: false,
    resave: true,
}))

app.get('/', (req, res) => {
    // res.cookie("test", 123);
    // console.log("Session : ", req.session)
    console.log("Session User : ", req.session.user)
    console.log("Sessinon ID : ", req.sessionID)
    if (req.session.user) {
        return res.redirect('/welcome')
    }
    res.render('index', { alert: 'Waiting' })
});

function auth(req, res, next) {
    if (req.session.user) {
        console.log('authenticated')
        next()
    } else {
        console.log('not authenticated')
        return res.redirect('/')
    }
    next()
}
app.get('/welcome', auth, (req, res) => {
    const userName = req.session.user
    return res.render('welcome', { message: `Welcome back, ${userName}!` })
})

app.post('/login', (req, res) => {
    const users = [
        {
            firstName: 'Tony',
            email: 'tony@stark.com',
            password: '123'
        },
        {
            firstName: 'Steve',
            email: 'captain@hotmail.com',
            password: 'icandothisallday'
        },
    ]
    console.log("Table message :", req.body, req.query);

    const { email, password } = req.body
    if (email.trim() === '' || password.trim() === '') {
        return res.render('index', { alert: 'Password or email is incorrect, please try again!' })
    }
    for (let user of users) {
        if (user.email === email && user.password === password) {
            req.session.user = user.firstName
            return res.redirect('/welcome')
        }
    }
    return res.render('index', { alert: 'Password or email is incorrect, please try again!' })
})
app.get('/logout', auth, (req, res) => {
    req.session.destroy(() => {
        console.log('session destroyed')
    })
    res.render('index', { alert: 'You are logged out! Re-enter email and password to log in again!' })
})

app.listen(8080);


