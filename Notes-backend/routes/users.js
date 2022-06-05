var express = require('express');
var router = express.Router();
var mysql2 = require('mysql2/promise');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  // let result = await req.locals.con.query('SELECT * FROM users');
  // res.json(result[0]);
  res.send('respond with a resource');
});

router.post('/', async (req, res, next) => {
  try {
    const result = await req.locals.con.query(`INSERT INTO users (userEmail, userPass) VALUES ('${req.body.userEmail}', '${req.body.userPass}')`);
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
