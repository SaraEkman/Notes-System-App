var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql2 = require('mysql2/promise');
var cryptoJs = require('crypto-js');
var cors = require('cors');

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);

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

app.get('/getNotesWithUsers', async (req, res, next) => {
    try {
        const [users] = await app.locals.con.execute('SELECT * FROM users');
        const [notes] = await app.locals.con.execute('SELECT * FROM notes');
        console.log(users.length, notes.length);

        const notesWithUsers = users.map((user) => {
            const userNotes = notes.filter((note) => note.created_by === user.id);
            return {
                ...user,
                notes: userNotes
            };
        });

        res.json(notesWithUsers);

    } catch (err) {
        console.log(err);
    }
});

app.post('/createUser', async (req, res, next) => {
    try {
        let checkUser = await app.locals.con.query('SELECT * FROM users WHERE userEmail = ?', [req.body.userEmail]);
        if (checkUser[0].length > 0) {
            res.json({
                status: 'error',
                message: 'User already exists'
            });
        } else {
            const encryptedPass = cryptoJs.AES.encrypt(req.body.userPass, "passWord").toString();
            await app.locals.con.query(`INSERT INTO users (userEmail, userPass) VALUES ('${req.body.userEmail}', '${encryptedPass}')`);

            res.json({
                status: 'success',
                message: 'User created'
            });
        }
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
                    error: 'User not found'
                });
            }
        }

    } catch (err) {
        console.log(err);
    }
});

app.get('/allNotes', async (req, res, next) => {
    try {
        let result = await app.locals.con.query('SELECT * FROM notes');
        res.json(result[0]);
    } catch (err) {
        console.log(err);
    }
});

app.get('/getCreatedBy/:id', async (req, res, next) => {
    try {
        let result = await app.locals.con.query(`SELECT * FROM users WHERE id = ${req.params.id}`);
        res.json(result[0][0].userEmail);
    } catch (err) {
        console.log(err);
    }
});


app.get('/findNotes/:id', async (req, res, next) => {
    try {
        let result = await app.locals.con.query(`SELECT * FROM notes WHERE created_by = ${req.params.id}`);
        if (result[0].length === 0) {
            res.json('No notes found');
        }
        else {
            res.json(result[0]);
        }
    } catch (err) {
        console.log(err);
    }
});


app.post('/createNote', async (req, res, next) => {
    try {
        const result = await app.locals.con.execute((`INSERT INTO notes (content, created_at, created_by, updated_by, deleted) VALUES (?, ?, ?, ?, ?)`), [req.body.content, req.body.created_at, req.body.created_by, req.body.updated_by, req.body.deleted]);
        res.json(result);
    } catch (err) {
        console.log(err);
    }
});

app.put('/updateNote', async (req, res, next) => {
    try {
        const result = await app.locals.con.execute((`UPDATE notes SET content = ?, created_at = ?, created_by = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE id = ?`), [req.body.content, req.body.created_at, req.body.created_by, req.body.updated_at, req.body.updated_by, req.body.deleted, req.body.id]);
        res.json(result);
    } catch (err) {
        console.log(err);
    }
});

app.put('/deleteNote', async (req, res, next) => {
    try {
        const result = await app.locals.con.execute((`UPDATE notes SET deleted = ? WHERE id = ?`), [req.body.deleted, req.body.id]);
        res.json(result);
    } catch (err) {
        console.log(err);
    }
});

module.exports = app;
