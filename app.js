require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const LocalStrategy = require('passport-local').Strategy;

const passport = require('passport');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.SERVER_PORT || 3000;

nunjucks.configure('pages', {
    express: app,
})

app.use(
    session({
        secret: "secret key",
        resave: false,
        saveUninitialized: true,

        store: new MemoryStore({
            checkPeriod: 86400000, // 24 hours (= 24 * 60 * 60 * 1000 ms)
        })
    })
);

app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// passport 초기화 및 session 연결
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user_id = req.user ? req.user.id : null;
    res.locals.user_name = req.user ? req.user.name : null;
    next();
});

// login이 최초로 성공했을 때만 호출되는 함수
// done(null, user.id)로 세션을 초기화 한다.
passport.serializeUser(function (req, user, done) {
    console.log('serializeUser' + user);
    console.log('serializeUser' + user.id);
    console.log('serializeUser' + user.name);
    console.log('serializeUser' + user.acc);

    done(null, user);
});

// 사용자가 페이지를 방문할 때마다 호출되는 함수
// done(null, id)로 사용자의 정보를 각 request의 user 변수에 넣어준다.
passport.deserializeUser(function (req, user, done) {
    console.log('Login: ' + user.name);
    done(null, user);
});

// local login 전략을 세우는 함수
// client에서 전송되는 변수의 이름이 각각 id, pw이므로 
// usernameField, passwordField에서 해당 변수의 값을 받음
// 이후부터는 username, password에 각각 전송받은 값이 전달됨
// 위에서 만든 login 함수로 id, pw가 유효한지 검출
// 여기서 로그인에 성공하면 위의 passport.serializeUser 함수로 이동

passport.use(
    new LocalStrategy(
        {
            usernameField: "id",
            passwordField: "pwd",
        },
        function (userid, password, done) {
            console.log('--------------------------' + userid);
            console.log('--------------------------' + password);

            conn = dbConnect.getConnection();
            conn.query(db_sql.cust_select_one, [userid], (err, row, fields) => {

                if (err) throw err;

                let result = 0;
                console.log('--------------------------' + row[0]['pwd']);

                let name = row[0]['name'];
                let acc = row[0]['acc'];

                if (row[0] == undefined) {
                    return done(null, false, { message: "Login Fail " });
                } else if (row[0]['pwd'] != password) {
                    return done(null, false, { message: "Login Fail " });
                } else {
                    return done(null, { id: userid, name: name, acc: acc });
                }

            });

        }
    )
);

//main page
app.get('/', (req, res) => {
    res.render('');
});

//login page
app.get('/login', (req, res) => {
    res.render('login');
})

// app.post('/login', passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/loginfail'
// }))

// app.get('/loginfail', (req, res) => {
//     res.render('index', { center: 'loginfail' });
// })

// app.get('/logout', (req, res) => {
//     req.session.destroy();
//     res.redirect('/');
// })

//addProduct page
app.get('/addProduct', (req, res) => {
    res.render('addProduct');
})

//index page
app.get('/index', (req, res) => {
    res.render('index');
})

//register page
app.get('/register', (req, res) => {
    res.render('register');
})

//shopping page
app.get('/shopping', (req, res) => {
    res.render('shopping');
})

app.get('/register', (req, res) => {
    res.render('index', { center: 'register' });
})
    .post('/registerimpl', (req, res) => {
        conn = dbConnect.getConnection();

        try {
            conn.query(db_sql.cust_insert, [req.body.id, req.body.pwd, req.body.name, req.body.acc], (err, result, fields) => {
                res.render('index', { center: 'registerok', name: req.body.name });
            });
        } catch (err) {
            console.log(err);
        } finally {
            dbConnect.close(conn);
        }
    })

const administrator = require('./routes/administrator');
app.use('/administrator', administrator);

app.listen(port, () => {
    console.log(`Server start port: ${port}`);
})