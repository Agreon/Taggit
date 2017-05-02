/**
 * Created by daniel on 3/22/17.
 */
var mongoose = require('mongoose');

var LearnObjectSchema = new mongoose.Schema({
    objectID: { // Referenced Object
        type: mongoose.Schema.Types.ObjectId,
    },
    ownerID: { // Referenced Owner
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tags: {
        type: [],
        default: []
    },
    progress: { 
    	type: Number,
    	default: 0
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


// on every save, add the date
LearnObjectSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});


module.exports = mongoose.model('LearnObject', LearnObjectSchema, "LearnObjects");
