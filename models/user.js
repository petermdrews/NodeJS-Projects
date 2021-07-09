const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  /* Removed in favor of passport-mongoose-local, which handles this for us.
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  */
  firstname: {
    type: String,
    default: "",
  },
  lastname: {
    type: String,
    default: "",
  },
  facebookId: String,
  admin: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
