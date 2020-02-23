var Author = require('../models/author');
var Book = require('../models/book');
var async = require('async');
const validator = require('express-validator');

// Display list of all Authors.
exports.author_list = function (req, res, next) {
  Author
    .find()
    .exec(function (err, authors) {
      if (err) {
        return next(err);
      }

      res.render('author_list', {
        title: 'Author List',
        authors: authors
      })
    })
};

// Display detail page for a specific Author.
exports.author_detail = function (req, res, next) {
  async.parallel({
    author: function (callback) {

      Author.findById(req.params.id)
        .exec(callback);
    },
    author_books: function (callback) {

      Book.find({
          'author': req.params.id
        })
        .exec(callback);
    },
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    if (results.author == null) { // No results.
      var err = new Error('Author not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render.
    res.render('author_detail', {
      author: results.author,
      author_books: results.author_books
    });
  });
};

// Display Author create form on GET.
exports.author_create_get = function (req, res, next) {
  res.render('author_form', {
    title: 'Create Author'
  });
};

// Handle Author create on POST.
exports.author_create_post = [
  // Validate fields
  validator.body('first_name').trim()
  .isLength({
    min: 1
  }).withMessage('First name must be specified')
  .isAlphanumeric().withMessage('First name has non-alphanumeric characters'),

  validator.body('family_name').trim()
  .isLength({
    min: 1
  }).withMessage('Family name must be specified')
  .isAlphanumeric().withMessage('Family name has non-alphanumeric characters'),

  validator.body('date_of_birth').optional({
    checkFalsy: true
  }).isISO8601().withMessage('Invalid date of birth'),

  validator.body('date_of_death').optional({
    checkFalsy: true
  }).isISO8601().withMessage('Invalid date of birth'),

  // Sanitize fields:
  validator.sanitizeBody('first_name').escape(),
  validator.sanitizeBody('first_name').escape(),
  validator.sanitizeBody('date_of_birth').toDate(),
  validator.sanitizeBody('date_of_death').toDate(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('author_form', {
        title: 'Create Author',
        author: req.body,
        errors: errors.array()
      });
      return;
    } else {
      // Data from form is valid.

      // Create an Author object with escaped and trimmed data.
      var author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
      });
      author.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new author record.
        res.redirect(author.url);
      });

    }
  }
];

// Display Author delete form on GET.
exports.author_delete_get = function (req, res, next) {
  async.parallel({
    author: function (callback) {
      Author.findById(req.params.id)
        .exec(callback)
    },
    author_books: function (callback) {
      Book.find({
          'author': req.params.id
        })
        .exec(callback);
    }
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    if (results.author == null) {
      res.redirect('/catalog/authors');
    }

    // Successful, so render
    res.render('author_delete', {
      title: 'Delete Author',
      author: results.author,
      author_books: results.author_books
    });
  });
};

// Handle Author delete on POST.
exports.author_delete_post = function (req, res, next) {
  async.parallel({
    author: function (callback) {
      Author.findById(req.body.authorid).exec(callback);
    },
    author_books: function (callback) {
      Book.find({
        'author': req.body.authorid
      }).exec(callback);
    }
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    // Success
    if (results.author_books.length > 0) {
      res.render('author_delete', {
        title: 'Delete Author',
        author: results.author,
        author_books: results.author_books
      });
      return;
    } else {
      Author.findByIdAndRemove(req.body.authorid, function (err) {
        if (err) {
          return next(err);
        } else {
          res.redirect('/catalog/authors');
        }
      })
    }
  })
};

// Display Author update form on GET.
exports.author_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update POST');
};