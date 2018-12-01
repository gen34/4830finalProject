const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname));

// mongoose.connect('mongodb://ncmsuser:ncmspwd@tongedev.cn:27017/ncmsdb');
mongoose.connect('mongodb://shihaodai.com:27017/ncmsdb');

const User = mongoose.model('User', {
    username: String,
    password: String
});

var Content = mongoose.model('Content', {
    username: String,
    content: String,
    date: String,
    image: String
});

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

app.post('/api/login', function (req, res) {
    const params = {
        username: req.body.username,
        password: req.body.password
    }
    User.findOne(params, function (err, docs) {
        res.send({
            count: 0,
            message: 'success',
            state: 1,
            data: docs
        });
    });
});

app.post('/api/register', function (req, res) {
    const params = {
        username: req.body.username,
        password: req.body.password
    }
    User.findOne(params, function (err, docs) {
        if (docs == null) {
            const user = new User(params);
            user.save(function (err) {
                if (err) {
                    console.log(err);
                }
                res.send({
                    count: 0,
                    message: 'register success!',
                    state: 1,
                    data: true
                });
            });
        } else {
            res.send({
                count: 0,
                message: 'username exists!',
                state: 1,
                data: false
            });
        }
    });
});

app.get('/api/get', function (req, res) {
    var pageNo = parseInt(req.query.pageNo);
    var pageSize = parseInt(req.query.pageSize);
    Content.find({}, {
        __v: 0
    }).sort({
        date: -1
    }).skip((pageNo - 1) * pageSize).limit(pageSize).exec(function (err, docs) {
        res.send({
            count: 0,
            message: 'success',
            state: 1,
            data: docs
        });
    })
});

app.get('/api/search', function (req, res) {
    var pageNo = parseInt(req.query.pageNo);
    var pageSize = parseInt(req.query.pageSize);
    Content.find({ content: new RegExp(req.query.content) }, {
        __v: 0
    }).sort({
        date: -1
    }).skip((pageNo - 1) * pageSize).limit(pageSize).exec(function (err, docs) {
        res.send({
            count: 0,
            message: 'success',
            state: 1,
            data: docs
        });
    })
});

app.post('/api/post', function (req, res) {
    console.log(req.body)
    const content = new Content(req.body);
    content.save(function (err) {
        if (err) {
            console.log(err);
        }
        res.send({
            count: 0,
            message: 'success',
            state: 1,
            data: true
        });
    })
});

app.post('/api/del', function (req, res) {
    Content.deleteOne({ _id: req.body._id }, function (err) {
        res.send({
            count: 0,
            message: 'delete success!',
            state: 1,
            data: true
        });
    });
});

var multer = require('multer');
var upload = multer({ dest: 'upload/' });
var fs = require('fs');

/** Permissible loading a single file, 
    the value of the attribute "name" in the form of "recfile". **/
var type = upload.single('recfile');

app.post('/api/upload', type, function (req, res) {

    /** When using the "single"
        data come in "req.file" regardless of the attribute "name". **/
    var tmp_path = req.file.path;

    /** The original name of the uploaded file
        stored in the variable "originalname". **/
    var target_path = 'upload/' + req.file.originalname;

    /** A better way to copy the uploaded file. **/
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function () {
        res.send({
            count: 0,
            message: 'success',
            state: 1,
            data: target_path
        });
    });
    src.on('error', function (err) {
        console.log(JSON.stringify(err));
        res.send(JSON.stringify(err));
    });

});


app.listen(8081);