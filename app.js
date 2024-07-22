// Package 
require('dotenv').config();
const express = require('express');
const session = require('express-session');

const nunjucks = require('nunjucks');
const bodyParser = require('body-parser')
const app = express();
const port = process.env.SERVER_PORT || 3000;

// session 저장소 지정(메모리)
const MemoryStore = require("memorystore")(session);
// Passport lib 
const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy;

// Database 연동
var db_connect = require('./db/db_connect');
var db_sql = require('./db/db_sql');

// My util
var goto = require('./util/goto');

// CORS 지정
const cors = require("cors");
app.use(cors());
// HTML 파일 위치 views
nunjucks.configure('views', {
    express: app,
});

// html 환경 설정, post, public
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false })); //객체 들어감. 추가 2 
app.use(express.static('public'));


// Session 선언
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


// 2. Passport를 이용한 로그인 처리 ---------------------------------------------------------------------------------------

// passport 초기화 및 session 연결
app.use(passport.initialize());
app.use(passport.session());

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
    console.log('Login User' + user.name + ' ' + user.id);
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

            conn = db_connect.getConnection();
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

// login 요청이 들어왔을 때 성공시 / 로, 실패시 /login 으로 리다이렉트
app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/loginerror",
    })
);

// 2. Passport를 이용한 로그인 처리 끝---------------------------------------------------------------------------------------
app.get('/loginerror', (req, res) => {
    res.render('index', {
        center: 'loginerror'
    })
})




// Controller
// 127.0.0.1/

app.get('/', (req, res) => {
    goto.go(req, res, undefined);
});
// Login 화면
app.get('/pages/login', (req, res) => {
    goto.go(req, res, { 'center': 'login' });
});
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})
// Register 화면
app.get('/register', (req, res) => {
    goto.go(req, res, { 'center': 'register' });
});
app.post('/registerimpl', (req, res) => {
    // 입력값 받기
    let id = req.body.id;
    let pwd = req.body.pwd;
    let name = req.body.name;
    let acc = req.body.acc;
    console.log(id + ' ' + pwd + ' ' + name + ' ' + acc);
    // DB에 입력 하고 center에 회원가입을 축하합니다. 출력
    let values = [id, pwd, name, acc];
    conn = db_connect.getConnection();

    conn.query(db_sql.cust_insert, values, (e, result, fields) => {
        try {
            if (e) {
                console.log('Insert Error');
                console.log(e);
                throw e;
            } else {
                console.log('Insert OK !');
                goto.go(req, res, { 'center': 'registerok', 'name': name });
            }
        } catch (e) {
            console.log(e);
        } finally {
            db_connect.close(conn);
        }
    });
});
// Map 화면
app.get('/map', (req, res) => {
    goto.go(req, res, { 'center': 'map' });
});
app.get('/map2', (req, res) => {
    goto.go(req, res, { 'center': 'map2' });
});
// Chart 화면
app.get('/chart', (req, res) => {
    goto.go(req, res, { 'center': 'chart' });
});
app.get('/chart2', (req, res) => {
    goto.go(req, res, { 'center': 'chart2' });
});

// MyInfo 화면
app.get('/myinfo', (req, res) => {
    let id = req.query.id;
    conn = db_connect.getConnection();
    conn.query(db_sql.cust_select_one, id, (err, result, fields) => {
        try {
            if (err) {
                console.log('Select Error');
                throw err;
            } else {
                console.log(result);
                custinfo = result[0];
                console.log(custinfo);
                goto.go(req, res, { 'center': 'myinfo', 'custinfo': custinfo });
            }
        } catch (e) {
            console.log(e);
        } finally {
            db_connect.close(conn);
        }
    });
});
app.post("/updateimpl", (req, res) => {
    let id = req.body.id;
    let pwd = req.body.pwd;
    let name = req.body.name;
    let acc = req.body.acc;
    console.log(id + ' ' + pwd + ' ' + name + ' ' + acc);
    let values = [pwd, name, acc, id];
    conn = db_connect.getConnection();

    conn.query(db_sql.cust_update, values, (e, result, fields) => {
        try {
            if (e) {
                console.log('Update Error'); 
                console.log(e);
                throw e;
            } else {
                console.log('Update OK !');
                res.redirect('/myinfo?id=' + id);
            }
        } catch (e) {
            console.log(e);
        } finally {
            db_connect.close(conn);
        }

    });
});
// Detail 화면
app.get('/detail', (req, res) => {
    goto.go(req, res, { 'center': 'detail' });
});

// Router 
const cust = require('./routes/cust');
const item = require('./routes/item');
const block = require('./routes/block');
app.use('/cust', cust);
app.use('/item', item);
app.use('/block', block);

app.listen(port, () => {
    console.log(`server start port:${port}`)
})