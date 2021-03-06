var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    max: 100
  },
  family_name: {
    type: String,
    required: true,
    max: 100
  },
  date_of_birth: {
    type: Date
  },
  date_of_death: {
    type: Date
  }
});

// Virtual for author's full name
AuthorSchema.virtual('name')
  .get(function () {
    var fullname = '';
    if (this.first_name && this.family_name) {
      fullname = this.family_name + ', ' + this.first_name
    }

    return fullname;
  });

// Virtual for author's lifespan
AuthorSchema.virtual('lifespan')
  .get(function (params) {
    // If not null nor undefined
    if (this.date_of_death && this.date_of_birth) {
      return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
    }
    return undefined;
  });

// Virtual for author's URL
AuthorSchema.virtual('url')
  .get(function () {
    return '/catalog/author/' + this._id;
  });

AuthorSchema.options.toJSON = {
  virtuals: true
};

module.exports = mongoose.model('Author', AuthorSchema);