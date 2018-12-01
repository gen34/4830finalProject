var mongoose = require('mongoose');
mongoose.connect('mongodb://newsuser:newspwd@localhost:27017/newsdb');
var z_news = mongoose.model('z_news', {
    title: String,
    url: String,
    date: String,
    summary: String,
    image: String
});

var Crawler = require("crawler");
var c = new Crawler({
    maxConnections: 10,
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            if (res.statusCode == 500)
                return;
            console.log(res.statusCode);
        }
        done();
    }
});

function start() {
    c.queue({
        uri: 'http://www.komu.com/news',
        callback: (error, res, done) => {
            if (error) {
                console.log(error);
            } else {
                saveResult(res,0);
            }
            done();
        }
    });
}

function saveResult(res,i) {
    var $ = res.$;
    var arrayLi = $(".image-grid-items-container article");
    var news = new z_news();
    news.url = 'https://www.komu.com'+arrayLi[i].children[0].next.children[0].next.attribs.href
    news.title = arrayLi[i].children[0].next.children[0].next.attribs.title;
    news.summary = arrayLi[i].children[5].children[3].children[0].data;
    news.date = JSON.parse(JSON.stringify(arrayLi[i].children[5].children[5].children[1].attribs).replace('data-datetime', 'datetime').replace("{ts '", '').replace("'}", '')).datetime;
    news.image = JSON.parse(JSON.stringify(arrayLi[i].children[1].children[1].children[1].attribs).replace('data-original-image-url', 'imageurl')).imageurl;
    z_news.findOne({
        title: new RegExp(news.title)
    }, function (err, rs) {
        if (rs == null) {
            news.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`title: ${news.title}, source  ${news.date}`);
                }
                if (i < arrayLi.length-1) {
                    saveResult(res, ++i);
                }
            });
        } else {
            if (i < arrayLi.length-1) {
                saveResult(res, ++i);
            }
            console.log("exists-->" + news.title)
        }
    });
}


start();


var express = require('express');
var app = express();
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

app.get('/api/news/list', function (req, res) {
    let pageNo = parseInt(req.query.pageNo);
    let pageSize = parseInt(req.query.pageSize);
    z_news.find({}, {
        date: 0
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

var server = app.listen(8081, function () {
})