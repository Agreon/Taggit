/**
 * Created by daniel on 3/22/17.
 */
var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    tags: {
        type: [],
        default: []
    },
    documents: [],
    updated_at: {
        type: Date,
        default: Date.now()
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

ProjectSchema.statics.findByName = function(_id, _name, cb) {
  return this.find({ name: _name, ownerID: _id }, cb);
};

// on every save, add the date
ProjectSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;
    
    next();    
});

module.exports = mongoose.model('Project', ProjectSchema, "Projects");