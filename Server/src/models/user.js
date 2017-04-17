var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	local: {
		username: {
			type: String,
            unique: true,
			required: true
        },
		password: {
			type: String,
			required: true
		}
	},
    updated_at: {
        type: Date,
        default: Date.now()
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

userSchema.pre('save', function (next) {
	var user = this;

    // change the updated_at field to current date
    user.updated_at = new Date();

    // if created_at doesn't exist, add to that field
    if (!user.created_at){
        user.created_at = currentDate;
    }

    if (!user.isModified('local.password')){
    	return next();
    }
    this.local.password = bcrypt.hashSync(this.local.password, bcrypt.genSaltSync(8), null);
    next();
});

// Method to compare password for login
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.local.password, function(err, isMatch) {
        if (err) { return cb(err); }

        cb(null, isMatch);
    });
}

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema, "Users");
