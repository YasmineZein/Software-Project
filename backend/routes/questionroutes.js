const express = require('express');
const app = express.Router();
const {protect,admin}= require("../authMiddleware");
const User = require('../models/UserModel');
const Code = require('../models/CodeModel');
const { findById } = require('../models/UserModel');
const Questionm = require('../models/QuestionModel');

app.post("/",admin,async(req,res)=>{
    try{
    const {Name,Question,Answer1,Answer2,Answer3,Answer4,CorrectAnswer} =req.body;
    if( !Answer1 || !Answer2 || !Answer3 || !Answer4 || !CorrectAnswer)
        return res.status(404).json({msg:"need data"});

    const power = await Questionm.create({
        Name:Name,
        Question:Question,
        Answer1:Answer1,
        Answer2:Answer2,
        Answer3:Answer3,
        Answer4:Answer4,
        CorrectAnswer:CorrectAnswer
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
        let type = req.query.type;
        let s = req.query.s;
        if(s==""){
        const users = await Questionm.find().skip((num-1)*10).limit(10);
        res.status(200).json(users);
        }
        else if(type=="Name"){
            const users = await Questionm.find({Name: {$regex:  s}}).skip((num-1)*10).limit(10);
            res.status(200).json(users);
        }
        else if(type=="Question"){
            const users = await Questionm.find({Question: {$regex:  s}}).skip((num-1)*10).limit(10);
            res.status(200).json(users);
        }
        else{
            const users = await Questionm.find({Name: {$regex:  s}}).skip((num-1)*10).limit(10);
            res.status(200).json(users);
        }
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/delete",admin,async(req,res)=>{
    try{
    const {_id} =req.body;
        const codeExists = await Questionm.findOne({_id:_id});

        if(!codeExists)
        {
            res.status(400).json({msg:"الكود غير موجود"});
        return;
        }

        await Questionm.findOneAndDelete({_id:_id});

        res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/edit",admin,async(req,res)=>{
    try{
    const {_id,Name,Question,Answer1,Answer2,Answer3,Answer4,CorrectAnswer} =req.body;
    if(!_id||!Name || !Answer1 || !Answer2 || !Answer3 || !Answer4 || !CorrectAnswer)
        return res.status(404).json({msg:"need data"});

    const code = await Questionm.findByIdAndUpdate(_id,{
        Name:Name,
        Question:Question,
        Answer1:Answer1,
        Answer2:Answer2,
        Answer3:Answer3,
        Answer4:Answer4,
        CorrectAnswer:CorrectAnswer},{new:true});


    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

module.exports = app;