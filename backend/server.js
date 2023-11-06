// import session from 'express-session'
// import cookieParser from 'cookie-parser';
const session = require('express-session');
const cookieParser = require('cookie-parser');
const express=require("express");
const mysql=require("mysql");
const cors=require("cors");


const app=express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized: false,
    cookie:{
        secure: false,
        maxAge:1000*60*60*24
    }
}))

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"register_user"
})

app.post('/register',(req,res)=>{
    console.log(req);
    const sql="INSERT INTO user (`Hospital Name`, `Email Id`, `Address`, `Password`) VALUES (?)";
    const values=[
        req.body.hospitalname,
        req.body.email,
        req.body.address,
        req.body.createpassword
    ]
    console.log([values]);
    db.query(sql,[values],(err,data)=>{
        if(err){
            return res.json("Error while sending data");
        }
        else{
            return res.json(data);
        }
    })
})

app.post('/login',(req,res)=>{
    console.log(req);
    const sql="SELECT * FROM user WHERE `Email Id`=? AND `Password`=?";
    db.query(sql,[req.body.email,req.body.password],(err,data)=>{
        if(err){
            return res.json("Error");
        }
        // if(data.length>0){
        //     return res.json("Success");
        // }else{
        //     return res.json("Failed");
        // }

        if(data.length>0){
            req.session.username=data[0].username;
            console.log(req.session.username)
            return res.json({Login:true})
        }else{
            return res.json({Login:false})
        }
    })
})

const port=8081;
app.listen(port,()=>{
    console.log("Listing at port:",port);
})