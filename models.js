/**
 * Mongoose library for MongoDB object modeling.
 *
 * @type {Mongoose}
 */
const mongoose = require('mongoose');

/**
 * bcrypt library for hashing and comparing passwords.
 *
 * @type {bcrypt}
 */
const bcrypt = require('bcrypt');

/**
 * Mongoose schema for movies.
 *
 * @type {mongoose.Schema}
 */
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
  Year: String,
  TrailerPath: String,
  Rating: String,
  Runtime: String,
});

/**
 * Mongoose schema for users.
 *
 * @type {mongoose.Schema}
 */
let userSchema = mongoose.Schema({
  FullName: { type: String, required: true },
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

/**
 * Hashes a password using bcrypt.
 *
 * @param {string} password - The password to hash.
 * @returns {string} - The hashed password.
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Validates a password using bcrypt.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} - True if the password is valid, otherwise false.
 */
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

/**
 * Mongoose model for movies.
 *
 * @type {mongoose.Model}
 */
let Movie = mongoose.model('Movie', movieSchema);

/**
 * Mongoose model for users.
 *
 * @type {mongoose.Model}
 */
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
