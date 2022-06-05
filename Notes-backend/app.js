var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql2 = require('mysql2/promise');
var cryptoJs = require('crypto-js');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var notesRouter = require('./routes/notes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/notes', notesRouter);

const init = async () => {
    app.locals.con = await mysql2.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'notes',
        password: '123',
        database: 'notes'
    });
    console.log('Connected to database');
};
init();

app.get('/user', async (req, res, next) => {
    try {
        let result = await app.locals.con.query('SELECT * FROM users');
        res.json(result[0]);
    } catch (err) {
        console.log(err);
    }
});

app.post('/createUser', async (req, res, next) => {
    try {
        const encryptedPass = cryptoJs.AES.encrypt(req.body.userPass, "passWord").toString();
        const result = await app.locals.con.query(`INSERT INTO users (userEmail, userPass) VALUES ('${req.body.userEmail}', '${encryptedPass}')`);
        res.json(result);
    } catch (err) {
        console.log(err);
    }
});

app.post('/logIn', async (req, res, next) => {
    try {
        const result = await app.locals.con.query(`SELECT userPass FROM users WHERE userEmail = '${req.body.userEmail}'`);
        if (result[0].length === 0) {
            res.json({
                error: 'User not found'
            });
        } else {
            const originPass = cryptoJs.AES.decrypt(result[0][0].userPass, "passWord").toString(cryptoJs.enc.Utf8);
            console.log(originPass);
            if (originPass === req.body.userPass) {
                const id = await app.locals.con.query(`SELECT id FROM users WHERE userEmail = '${req.body.userEmail}'`);
                res.json({
                    id: id[0][0].id
                });
            }
            else {
                res.json({
                    error: 'Wrong password'
                });
            }
        }
       
    } catch (err) {
        console.log(err);
    }
});


app.post('/createNote', async (req, res, next) => {
    try {
        const result = await app.locals.con.execute((`INSERT INTO notes (title, content, created_at, created_by, updated_by, completed, deleted) VALUES (?, ?, ?, ?, ?, ?, ?)`), [req.body.title, req.body.content, req.body.created_at, req.body.created_by, req.body.updated_by, req.body.completed, req.body.deleted]);
        res.json(result);
    } catch (err) {
        console.log(err);
    }
});

app.post('/updateNote', async (req, res, next) => {
    try {
        const result = await app.locals.con.execute((`UPDATE notes SET title = ?, content = ?, created_at = ?, created_by = ?, updated_by = ?, completed = ?, deleted = ? WHERE id = ?`), [req.body.title, req.body.content,req.body.created_at, req.body.created_by, req.body.updated_by, req.body.completed, req.body.deleted, req.body.id]);
        res.json(result);
    } catch (err) {
        console.log(err);
    }
})

app.post('/deleteNote', async (req, res, next) => {
    try {
        const result = await app.locals.con.execute((`UPDATE notes SET deleted = ? WHERE id = ?`), [req.body.deleted, req.body.id]);
        res.json(result);
    } catch (err) {
        console.log(err);
    }
    })

module.exports = app;
