var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('Notes');
});

router.post('/', async (req, res, next) => {
    const result = await req.con.query('INSERT INTO notes (title, content,created_by, updated_at, updated_by, completed, completed_at, completed_by, deleted, deleted_at, deleted_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [req.body.title, req.body.content, req.body.created_by, req.body.updated_at, req.body.updated_by, req.body.completed, req.body.completed_at, req.body.completed_by, req.body.deleted, req.body.deleted_at, req.body.deleted_by]);
    res.send(result);
});



module.exports = router;
