const express = require('express')
const app = express();

const Subject = require('../models/subject');

app.get('/', async (req, res) => {
    try {
        // Fetch all indicators from the database
        const Subjects = await Subject.find().sort({area : 1});

        // Render the Indicators page with the retrieved data
        res.render('Subjects', { Subjects });
    } catch (error) {
        console.error('Error fetching indicators:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle form submission for adding a new indicator
app.post('/', async (req, res) => {
    try {
        // Extract data from the form
        const { SubjectName } = req.body;

        // Create a new indicator instance
        const newSubject = new Subject({
            SubjectName 
        });

        // Save the new indicator to the database
        await newSubject.save();

        // Redirect back to the Indicators page after adding
        res.redirect('/Subjects');
    } catch (error) {
        console.error('Error adding Subjects:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle form submission for deleting an indicator
app.post('/deleteSubject/:id', async (req, res) => {

    try {
        const SubjectId = req.params.id;

        // Find and delete the indicator by ID
        const deletedSubject = await Subject.findByIdAndDelete(SubjectId);

        if (!deletedSubject) {
            return res.status(404).send('Subject not found');
        }
        res.redirect('/Subjects');
        
    } catch (error) {
        console.error('Error deleting indicator:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app;