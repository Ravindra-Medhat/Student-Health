const express = require('express');
const userRout = require('./userRout');
const detailsRout = require('./detailsRout');
const marksRout = require('./marksRout');
const profileRout = require('./profileRout');
const indicatorRout = require('./subjectRout');
const jwt = require("jsonwebtoken");
const app = express();



const verifyUser = (req,res,next)=>{
    const t = req.cookies.BHC;
    if(t){
        jwt.verify(t,"RKM",(err,decode)=>{
            if(err){
                res.redirect("/user/login");
            }
            req.data = decode.data;
            next();
    });
    }else{
        res.redirect("/user/login");
    }
}

const verifyAdmin = (req,res,next)=>{
    const t = req.cookies.BHC;
    if(t){
        jwt.verify(t,"RKM",(err,decode)=>{
            if(err || decode.data.Roal != "Admin"){
                res.redirect("/Company/marksList");
            }
            req.data = decode;
            next();
    });
    }else{
        res.redirect("/user/login");
    }
}

app.use("/user",userRout);
app.use("/detail",detailsRout);
app.use("/profile",verifyUser,profileRout);
app.use("/marks",verifyUser,marksRout);
app.use("/Subjects",verifyAdmin,indicatorRout);

app.use((req,res)=>{
    console.log(req.url);
    res.redirect("/marks/marksList");
})

module.exports=app;