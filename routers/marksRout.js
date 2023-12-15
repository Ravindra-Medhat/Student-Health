const express = require('express')
const app = express();
// const moment = require('moment');
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');

const Subject = require('../models/subject');  
const Marks = require('../models/marks');

app.get("/marksList", async (req, res) => {

    function calculateOverallScore(data) {
        let totalScore = 0;
        let totalSubject = 0;

        data.forEach(sm => {
            totalScore += sm.Marks;
            totalSubject += 1;
        });

        const overallScore = totalSubject > 0 ? (totalScore / totalSubject).toFixed(2) : 0;
        return overallScore;
    }

    try {
        
        if (req.data.Roal === "Admin" ) {
            if (req.query.str != null) {
                var cn = req.query.str;

                cn = cn.replace(/^\s+|\s+$/g, "");


                const marks = await Marks.find({ StudentName: { $regex: cn, $options: 'i' } }).sort({ timestamps: 1 }).sort({Name:1});

                const formattedMarks = marks.map(mark => ({
                    id: mark._id,
                    Name: mark.StudentName,
                    formattedTimestamp: moment(mark.timestamps).tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss'),
                    overallScore: calculateOverallScore(mark.Data),
                }));
                res.render('marksList', { marks: formattedMarks, isAdmin: true });

            } else {

                const marks = await Marks.find().sort({ timestamps: -1 });
                const last10Marks = marks.slice(0, 10);

                const formattedMarks = last10Marks.map(mark => ({
                    id: mark._id,
                    Name: mark.StudentName,
                    formattedTimestamp: moment(mark.createdAt).tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss'),
                    overallScore: calculateOverallScore(mark.Data),
                }));

                res.render('marksList', { marks: formattedMarks, isAdmin: true });
            }

        } else if (req.data.Roal === "Student") {

            const Name = req.data.Name;
            const ratings = await Marks.find({ StudentName: Name }).sort({ timestamps: 1 });

            const formattedMarks = ratings.map(mark => ({
                id: mark._id,
                Name: mark.StudentName,
                formattedTimestamp: moment(mark.createdAt).tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss'),
                overallScore: calculateOverallScore(mark.Data),
            }));

            res.render('marksList', { marks: formattedMarks, isAdmin: false, Name: Name });

        } else {
            res.status(403).send("Unauthorized");
        }
    } catch (error) {
        console.error("Error fetching marks:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/addMarks",async (req,res)=>{
    const Subjects = await Subject.find().sort({area : 1});
    res.render('AddMarks', { Subjects });
});

app.post('/submit-marks', async (req, res) => {
    

    const transformedData = [];

    const StudentName = req.data.Name;

    const Subjects = await Subject.find().sort({area : 1});

    Subjects.forEach((item, index) => {
        const subject = item.SubjectName;
        const mark = parseInt(req.body[`mark-${index}`]);
        transformedData.push({ Subject : subject , Marks : mark});
    });

    // Create the final data object
    const finalData = {
        StudentName: StudentName,
        Data: transformedData,
    };
    

    try {
        const data = new Marks(finalData);
        data.save().then((savedata)=>{
           
            sendEmail(req.data.Email,req.data.Name,savedata._id);
            res.redirect('/detail/'+savedata._id);
        });
    } catch (err) {
        console.log(err);
        res.redirect('/NotAdded');

    }

});

async function sendEmail(email,Name,id) {
    try {
        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mazzking666@gmail.com',  // replace with your Gmail email address
                pass: 'xctj naln sjnj gjsv',  // replace with your Gmail password
            },
        });
        
        // Email content
        const mailOptions = {
            from: 'mazzking666@gmail.com',  // replace with your Gmail email address
            to: email,  // replace with the recipient's email address
            subject: 'New Ratings Submitted',
            text: `New ratings have been submitted for ${Name}.\n For details :- https://student-health.cyclic.app/detail/${id}`,
        };

        // Send email
        await transporter.sendMail(mailOptions); 
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = app;