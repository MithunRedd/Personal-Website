const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const _ = require("lodash");

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost/blog", {
    useNewUrlParser: true, useUnifiedTopology: true
});

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

app.set('view engine', 'ejs');

const blogSchema = {
    title: String,
    content: String,
    created: {type: Date, default: Date.now}
}

const Blog = mongoose.model('Blog', blogSchema);

let posts = [];

app.get("/", function (req, res) {
    res.render("index", {
        posts:posts
    });
});


app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/contact", function (req, res) {
    res.render("contact");
});

app.get("/blog", function (req, res) {
    res.render("blog");
})

app.post("/blog", function (req, res) {
    const post = {
        title: req.body.postTitle,
        content: req.body.postBody
    };

    posts.push(post);

    res.redirect("/");
});

app.get("/posts/:postName", function (req, res) {
    const requestTitle = _.lowerCase(req.params.postName);

    posts.forEach(function (post) {
        const storedTitle = _.lowerCase(post.title);

        if (storedTitle === requestTitle) {
           res.render("post", {
                title: post.title,
                content: post.content,
            });
        }
    });

});


app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`App is Running at ${port}.`);
    }
})