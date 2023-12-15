// Create a ratings.model.js file
const mongoose = require('mongoose');

    const MarksSchema = new mongoose.Schema({
        StudentName : String,
        Data :[{
            Subject : String,
            Marks : Number
        }]
    },{
        timestamps: true
    });

const Marks = mongoose.model('Marks', MarksSchema);

module.exports = Marks;
