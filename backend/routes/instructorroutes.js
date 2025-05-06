const express = require('express');
const app = express.Router();
const {protect,admin}= require("../authMiddleware");
const User = require('../models/UserModel');
const Instructor = require('../models/InstructorModel');
const { findById } = require('../models/UserModel');

app.post("/",admin,async(req,res)=>{
    try{
    const {Name,Img} =req.body;
    if(!Name || !Img)
        return res.status(404).json({msg:"need data"});
    
        const codeExists = await Instructor.findOne({Name:Name});

        if(codeExists)
        {
            res.status(400).json({msg:"المدرس موجود بالفعل"});
        return;
        }

        

    const power = await Instructor.create({
        Name:Name,
        Img:Img
    });

    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/",admin,async(req,res)=>{
    try{
        let num = req.query.num;
        const Instructors = await Instructor.find().skip((num-1)*10).limit(10);
        res.status(200).json(Instructors);
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/delete",admin,async(req,res)=>{
    try{
    const {_id} =req.body;
        const codeExists = await Instructor.findOne({_id:_id});

        if(!codeExists)
        {
            res.status(400).json({msg:"المدرس غير موجود"});
        return;
        }

        await Instructor.findOneAndDelete({_id:_id});

        res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/edit",admin,async(req,res)=>{
    try{
    const {_id,Name,Img} =req.body;
    if(!Name || !Img)
        return res.status(404).json({msg:"need data"});

        const code = await Instructor.findByIdAndUpdate(_id,{Name:Name,Img:Img},{new:true});


    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

module.exports = app;