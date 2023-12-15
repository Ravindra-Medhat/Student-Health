const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    Subject: String,
});

const SubjectModel = mongoose.model('Subject', SubjectSchema);

module.exports = SubjectModel;
