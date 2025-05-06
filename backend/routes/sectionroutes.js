const express = require('express');
const app = express.Router();
const {protect,admin}= require("../authMiddleware");
const User = require('../models/UserModel');
const Code = require('../models/CodeModel');
const { findById } = require('../models/UserModel');
const Section = require('../models/SectionModel');


app.post("/",admin,async(req,res)=>{
    try{
    const {Name,Blocks} =req.body;
    if(!Name || !Blocks )
        return res.status(404).json({msg:"need data"});


    const power = await Section.create({
        Name:Name,
        Blocks:Blocks,
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
        const users = await Section.find().skip((num-1)*10).limit(10).populate("Blocks","_id Name");
        res.status(200).json(users);
        }
        else{
            const users = await Section.find({Name: {$regex:  s}}).skip((num-1)*10).limit(10).populate("Blocks","_id Name");
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
        const codeExists = await Section.findOne({_id:_id});

        if(!codeExists)
        {
            res.status(400).json({msg:"الكود غير موجود"});
        return;
        }

        await Section.findOneAndDelete({_id:_id});

        res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/edit",admin,async(req,res)=>{
    try{
        const {_id,Name,Blocks} =req.body;
        if(!_id||!Name ||!Blocks )
                return res.status(404).json({msg:"need data"});

    const code = await Section.findByIdAndUpdate(_id,{
        Name:Name,
        Blocks:Blocks,
    },{new:true});


    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})


module.exports = app;