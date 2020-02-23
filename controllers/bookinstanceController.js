var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
const validator = require('express-validator');

// Display list of all BookInstances.
exports.bookinstance_list = function (req, res, next) {
  BookInstance.find()
    .populate('book')
    .exec(function (err, bookinstances) {
      if (err) {
        return next(err);
      }
      res.render('bookinstance_list', {
        title: 'Book Instance List',
        bookinstances: bookinstances
      })
    });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function (req, res, next) {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) {
        return next(err);
      }
      if (bookinstance == null) { // No results.
        var err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('bookinstance_detail', {
        title: 'Copy: ' + bookinstance.book.title,
        bookinstance: bookinstance
      });
    })
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function (req, res, next) {
  Book.find({}, 'title')
    .exec(function (err, books) {
      if (err) {
        return next(err);
      } else {
        res.render('bookinstance_form', {
          title: 'Create BookInstance',
          book_list: books
        });
      }
    })
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  // Validate fields.
  validator.body('book').trim().isLength({
    min: 1
  }).withMessage('Book must be specified'),

  validator.body('imprint').trim().isLength({
    min: 1
  }).withMessage('Imprint must be specified'),

  validator.body('due_back').optional({
    checkFalsy: true
  }).isISO8601().withMessage('Invalid date'),

  // Sanitize fields.
  validator.sanitizeBody('book').escape(),
  validator.sanitizeBody('imprint').escape(),
  validator.sanitizeBody('status').trim().escape(),
  validator.sanitizeBody('due_back').toDate(),

  (req, res, next) => {
    const errors = validator.validationResult(req);

    var bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });

    if (!errors.isEmpty()) {
      Book.find({}, 'title')
        .exec(function (err, books) {
          if (err) {
            return next(err);
          } else {
            res.render('bookinstance_form', {
              title: 'Create BookInstance',
              book_list: books,
              errors: errors.array(),
              bookinstance: bookinstance
            })
          }
        });
      return;
    } else {
      bookinstance.save(function (err) {
        if (err) {
          return next(err);
        } else {
          res.redirect(bookinstance.url);
        }
      });
    }
  }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};