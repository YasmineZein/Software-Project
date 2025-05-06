const express = require('express');
const app = express.Router();
const {protect,admin}= require("../authMiddleware");
const User = require('../models/UserModel');
const Code = require('../models/CodeModel');
const { findById } = require('../models/UserModel');
const Exam = require('../models/ExamModel');
const Questionm = require('../models/QuestionModel');
const ExamDone = require('../models/ExamDoneModel');

app.post("/",admin,async(req,res)=>{
    try{
    const {Name,Questions,Private} =req.body;
    if(!Name || !Questions )
        return res.status(404).json({msg:"need data"});

    const power = await Exam.create({
        Name:Name,
        Questions:Questions,
        Private:Private,
       
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
        if(!s||s==""){
        const users = await Exam.find().skip((num-1)*10).limit(10).populate("Questions","_id Name");
        res.status(200).json(users);
        }
        else{
            const users = await Exam.find({Name: {$regex:  s}}).skip((num-1)*10).limit(10).populate("Questions","_id Name");
            res.status(200).json(users);
        }
    }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/exams",async(req,res)=>{
    try{
        let num = req.query.num;
        let type = req.query.type;
        let s = req.query.s;

        const users = await Exam.find({Private:false,Name: {$regex:  s?s:""}}).skip((1-1)*10).limit(10);

        res.status(200).json(users);
        }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/exams/:id",protect,async(req,res)=>{
    try{
        const exam = await Exam.findOne({_id:req.params.id,Private:false}).populate({ path: 'Questions', select: '-CorrectAnswer' });

        res.status(200).json(exam);
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/solveexam",protect,async(req,res)=>{
    try{
        const {_id,Questions} =req.body;
        if(!_id || !Questions)
            return res.status(404).json({msg:"need data"});

        const score =await Promise.all(  Questions.map(async(q)=>{
            const theq = await Questionm.findOne({_id:q._id,CorrectAnswer:q.Answer})
                 if(theq)
                 {
                     return true;
                 }
                 else
                 return false
        }))

        const exam = await Exam.findOne({_id:_id,Private:false}).populate({ path: 'Questions', select: '-Qimg -Answer1 -Answer2 -Answer3 -Answer4' });
        
        const done=await ExamDone.create({
            User:req.user._id,
            Result:score.filter(x => x==true).length,
            Total:score.length,
            Exam:_id
        });
        await User.findByIdAndUpdate(req.user._id,{
            Solvedexames:[...req.user.Solvedexames,done._id]
          })
        console.log(ExamDone)
        res.status(200).json({score:score.filter(x => x==true).length,examAnswers:exam});
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/delete",admin,async(req,res)=>{
    try{
    const {_id} =req.body;
        const codeExists = await Exam.findOne({_id:_id});

        if(!codeExists)
        {
            res.status(400).json({msg:"الكود غير موجود"});
        return;
        }

        await Exam.findOneAndDelete({_id:_id});

        res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/edit",admin,async(req,res)=>{
    try{
        const {_id,Name,Questions,Private} =req.body;
        if(!_id||!Name || !Questions )
            return res.status(404).json({msg:"need data"});

    const code = await Exam.findByIdAndUpdate(_id,{
        Name:Name,
        Questions:Questions,
        Private:Private,
       
    },{new:true});


    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})


module.exports = app;