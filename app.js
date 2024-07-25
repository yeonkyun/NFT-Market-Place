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
// Multer 사용
const multer  = require('multer')
const limits = {
    fieldNameSize: 200, // 필드명 사이즈 최대값 (기본값 100bytes)
    filedSize: 1024 * 1024, // 필드 사이즈 값 설정 (기본값 1MB)
    fields: 2, // 파일 형식이 아닌 필드의 최대 개수 (기본 값 무제한)
    fileSize : 16777216, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "16MB 설정" (기본 값 무제한)
    files : 10, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
}
// 파일 경로 및 이름 설정 옵션
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images') // 파일 업로드 경로
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) //파일 이름 설정
    }
  })
const upload = multer({ 
    storage: storage
}) 

// Database 연동
const { queryDatabase } = require('./database/dbConnect');
var dbSQL = require('./database/dbSQL');
var dbConnect = require('./database/dbConnect'); //dbConnect 정의 추가

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

//로그인 유지 부분
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


// 로그인 실패 시 표시할 페이지
app.get('/loginfail', (req, res) => {
    res.render('loginfail', { message: '로그인에 실패했습니다. 다시 시도해 주세요.' });
});



// local login 전략을 세우는 함수
// client에서 전송되는 변수의 이름이 각각 id, pw이므로 
// usernameField, passwordField에서 해당 변수의 값을 받음
// 이후부터는 username, password에 각각 전송받은 값이 전달됨
// 위에서 만든 login 함수로 id, pw가 유효한지 검출
// 여기서 로그인에 성공하면 위의 passport.serializeUser 함수로 이동

// const LocalStrategy = require('passport-local').Strategy;
// const dbConnect = require('./dbConnect'); // dbConnect 모듈을 적절히 설정해 주세요

passport.use(
    new LocalStrategy(
        {
            usernameField: 'id',
            passwordField: 'password'
        },
        async function (userid, password, done) {
            console.log('--------------------------' + userid);
            console.log('--------------------------' + password);

            try {
                // 사용자 정보를 조회하는 쿼리
                const result = await dbConnect.queryDatabase(dbSQL.getUserById, [userid]); // queries->dbSQL로 변경

                // 사용자 존재 확인
                if (result.length === 0) {
                    return done(null, false, { message: 'Login Fail: User not found' });
                }

                const user = result[0];
                console.log('--------------------------' + user.pw);

                // 비밀번호 확인
                if (user.pw !== password) {
                    return done(null, false, { message: 'Login Fail: Incorrect password' });
                }

                // 로그인 성공
                return done(null, { id: userid, name: user.name, acc: user.acc });
                
            } catch (err) {
                // 에러 처리
                console.error('Database error:', err);
                return done(err);
            }
        }
    )
);


// // main page
// app.get('/', (req, res) => {
//     res.render('index');
// });
//main
app.get('/index', async (req, res) => {
    try {
        console.log('Executing query:', dbSQL.getNftItem);
        const result = await queryDatabase(dbSQL.getNftItem);
        console.log('Query result:', result);

        res.render('index', { datas: result });
    } catch (e) {
        console.error('Error fetching NFT items', e);
        res.status(500).send('Database error');
    }
});

//login page
app.get('/login', (req, res) => {
    res.render('login');
})

// 로그인 라우트
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/loginfail'
}))

// app.get('/loginfail', (req, res) => {
//     res.render('index', { center: 'loginfail' });
// })

//로그아웃
app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        req.session.destroy();
        res.redirect('/');
    });
});
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


app.get('/itemdetail', async (req, res) => {
    const itemId = req.query.id; // 쿼리 파라미터에서 아이템 ID를 가져옵니다
    if (!itemId) {
        return res.status(400).send('Item ID is required'); // 아이템 ID가 없는 경우 400 에러를 반환합니다
    }

    try {
        console.log('Executing query:', dbSQL.getNftItemById);
        const result = await queryDatabase(dbSQL.getNftItemById, [itemId]);
        console.log('Query result:', result);

        if (result.length > 0) {
            const itemInfo = result[0];
            res.render('itemdetail', { iteminfo: itemInfo }); // 템플릿에 데이터를 전달합니다
        } else {
            res.status(404).send('Item not found'); // 아이템이 없는 경우 404 에러를 반환합니다
        }
    } catch (e) {
        console.error('Error fetching item details', e);
        res.status(500).send('Database error'); // 에러 발생 시 500 에러를 반환합니다
    }
});
// 회원가입
app.post('/registerimpl', async (req, res) => {
    // 입력값 받기
    let id = req.body.id;
    let pwd = req.body.pwd;
    let name = req.body.name;
    let nickname = req.body.nickname;
    let acc = req.body.acc;
    let phn = req.body.phn;
    let reg_date = req.body.reg_date;
    let user_type = req.body.user_type || 'user'; // user_type 기본값 설정

    console.log(id + ' ' + pwd + ' ' + name + ' ' + nickname + ' ' + acc + ' ' + phn + ' ' + reg_date);

    // DB에 입력하고 center에 회원가입을 축하합니다. 출력
    let values = [id, pwd, name, nickname, acc, phn, reg_date, user_type];

    try {
        await queryDatabase(dbSQL.createUser, values);
        console.log('Insert OK!');
        res.render('registerok', { name });
    } catch (e) {
        console.log('Insert Error');
        console.log(e);
        res.status(500).send('Database error');
    }
});
// nft_item 등록
app.post('/nftitem', upload.single('image'), async (req, res) => {
    // 입력값 받기
    let name = req.body.name;
    const { originalname } = req.file;
    let price = parseFloat(req.body.price); // 가격은 숫자 형태로 변환
    // 값이 제대로 전송되었는지 확인
    console.log(`input data ${name}, ${originalname}, ${price}`);

    let values = [name, originalname, price];

    try {
        // 쿼리 실행
        await queryDatabase(dbSQL.createNftItem, values);
        console.log('Insert OK!');
        res.render('addproductok', { name });
    } catch (e) {
        console.log('Insert Error');
        console.log(e);
        res.status(500).send('Database error');
    }
});


app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

// const administrator = require('./routes/administrator');
// app.use('/administrator', administrator);

app.listen(port, () => {
    console.log(`Server start port: ${port}`);
})