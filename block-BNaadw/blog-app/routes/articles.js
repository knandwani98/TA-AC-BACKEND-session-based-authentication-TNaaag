var express = require("express");
var router = express.Router();

var Article = require("../models/Article");
var Comment = require("../models/Comment");

//  ARTCILES ROUTE
router.get("/", function (req, res, next) {
  res.redirect("/");
});

// NEW ARTICLE FORM PAGE
router.get("/new", (req, res, next) => {
  // restritions
  if (req.session.user && req.cookies["connect.sid"]) {
    res.render("createArticle");
  } else {
    return res.redirect("/users/login");
  }
});

// CREATING AN ARTICLE
router.post("/", (req, res, next) => {
  var author = req.session.user._id,
    { title, description } = req.body;

  Article.create({ title, author, description }, (err, article) => {
    // if (err) return next(err);
    console.log(err, author);
    res.redirect("/");
  });
});

// READING SINGLE ARTICLE
router.get("/:slug", (req, res, next) => {
  var slug = req.params.slug;
  Article.findOne({ slug })
    .populate("comments")
    .populate("author")
    .exec((err, article) => {
      if (err) return next(err);
      res.render("article", { article });
    });
});

// ARTICLE EDIT PAGE
router.get("/:slug/edit", (req, res, next) => {
  var slug = req.params.slug;
  Article.findOne({ slug }, (err, article) => {
    if (err) return next(err);
    res.render("editArticle", { article });
  });
});

// UPDATING AN ARTICLE
router.post("/:slug", (req, res, next) => {
  var slug = req.params.slug;
  Article.findOneAndUpdate({ slug }, req.body, (err, article) => {
    if (err) return next(err);
    res.redirect("/articles/" + slug);
  });
});

// DELETING AN ARTICLE
router.get("/:slug/delete", (req, res, next) => {
  var slug = req.params.slug;
  Article.findOneAndDelete({ slug }, (err, deletedArticle) => {
    if (err) return next(err);
    Comment.deleteMany({ articleId: slug }, (err, deletedComments) => {
      if (err) return next(err);
      res.redirect("/");
    });
  });
});

// POSTING NEW COMMENT
router.post("/:slug/comments/new", (req, res, next) => {
  if (req.body) {
    var { content } = req.body,
      slug = req.params.slug,
      userId = req.session.user._id,
      articleId = slug;

    // CREATING COMMENT
    Comment.create({ content, userId, articleId }, (err, comment) => {
      if (err) return next(err);
      Article.findOneAndUpdate(
        { slug },
        { $push: { comments: comment.id } },
        (err, article) => {
          if (err) return next(err);
          res.redirect("/articles/" + article.slug);
        }
      );
    });
  }
});

// DELETING COMMENT
router.get("/:articleSlug/comments/:commentSlug/delete", (req, res, next) => {
  var commentSlug = req.params.commentSlug,
    articleSlug = req.params.articleSlug;

  Comment.findOneAndDelete({ slug: commentSlug }, (err, deletedComment) => {
    if (err) return next(err);
    Article.findOneAndUpdate(
      { slug: articleSlug },
      { $pull: { comments: deletedComment._id } },
      (err, updatedArticle) => {
        if (err) return next(err);
        res.redirect("/articles/" + articleSlug);
      }
    );
  });
});

module.exports = router;
