const express = require('express')
const app = express()
const Rating = require("../models/marks")
const Marks = require("../models/marks")

app.get('/:id', (req, res) => {
    Rating.findById(req.params.id).then((data) => {

        res.render('details', { id : req.params.id ,Company : data.CompanyName });
    }).catch((error) => {
        console.log(error);
        res.send(data_for_graph);
    });
        
});

app.get('/data/:id', (req, res) => {
    var id = req.params.id;

    Marks.findById(id).then((data) => {
        // console.log(data.Data);
        res.send(data.Data);

    }).catch((error) => {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    });
});

module.exports = app;