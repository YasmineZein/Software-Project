const express = require('express');
const app = express.Router();
const {protect,admin}= require("../authMiddleware");
const User = require('../models/UserModel');
const Code = require('../models/CodeModel');
const { findById } = require('../models/UserModel');
const Course = require('../models/CourseModel');
const Section = require('../models/SectionModel');
const { default: mongoose } = require('mongoose');


app.post("/",admin,async(req,res)=>{
    try{
    const {Name,Sections,Img,Private,Price,Isfree,Instructor} =req.body;
    
    if(!Name || !Sections ||!String(Price)||!String(Isfree)||!Img||!Instructor)
        return res.status(404).json({msg:"need data"});

        let time =Date.now ();
        var base64Data = Img.replace("data:image/*;base64,", "");
    
        require("fs").writeFile(__dirname+`/../imgs/${time}.png`, base64Data, 'base64', function(err) {
          console.log(err);
        });   

    const power = await Course.create({
        Name:Name,
        Sections:Sections,
        Price:Price,
        Isfree:Isfree,
        Img:`/imgs/${time}.png`,
        Private:Private,
        Instructor:Instructor
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
        const users = await Course.find().skip((num-1)*10).limit(10).populate("Sections","_id Name").populate("Instructor","_id Name");
        res.status(200).json(users);
        }
        else{
            const users = await Course.find({Name: {$regex:  s}}).skip((num-1)*10).limit(10).populate("Sections","_id Name");
            res.status(200).json(users);
        }
    }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/courses",protect,async(req,res)=>{
    try{
        let num = req.query.num;
        let type = req.query.type;
        let s = req.query.s;
        let instructor = req.query.instructor;
        let users;

        if(instructor=="")
            users = await Course.find({Private:false,Name: {$regex:  s?s:""}}).populate({path:"Instructor"}).skip((1-1)*10).limit(10);
        else
            users = await Course.find({Instructor:instructor?instructor:"",Private:false,Name: {$regex:  s?s:""}}).populate({path:"Instructor"}).skip((1-1)*10).limit(10);
        res.status(200).json(users);
        }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/courses/:id",protect,async(req,res)=>{
    try{
        let course = await Course.findOne({_id:req.params.id,Private:false}).populate({ path: 'Sections',populate:{path:"Blocks",select:"Name Type"}}).populate("Instructor");
        let have=false;
        req.user.Courses.forEach(s => {
            if(String(course._id)==String(s))
            {
                have=true;
            }
        });
        
        course={...course._doc,Sections:course.Sections,Have:have};
        res.status(200).json(course);
    }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/buy/:id",protect,async(req,res)=>{
    try{
        let course = await Course.findOne({_id:req.params.id});
        
        if(req.user.Money<course.Price)
            return res.status(400).json({msg:"ليس لديك المال الكافي"});

        req.user.Courses.map((s)=>{
            if(String(course._id)==String(s))
            return res.status(400).json({msg:"الحصة معاك بالفعل"});
        });

        const user=await User.findByIdAndUpdate(req.user._id,{
            Money:req.user.Money-course.Price,Courses:[...(req.user.Courses),course._id]
        },{ new: true })

        return res.status(200).json({Money:course.Price});
    }
    catch(e)
    {
        console.log(e);
    }
})

app.get("/:cid/section/:id",protect,async(req,res)=>{
    try{
        let section = await Section.findOne({_id:req.params.id}).populate("Blocks");
        let course = await Course.findOne({_id:req.params.cid});
        var VideoToken = Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2);

        await User.findByIdAndUpdate(req.user._id,{
            VideoToken
        })

        let have=false;
        let idx=0;
        if(!section.Isfree)
            req.user.Courses.map((s)=>{
                if(String(course._id)==String(s)){
                    return have=true;
                }
            });

        course.Sections.forEach((e,i) => {
            if(String(e._id)==String(section._id))idx=i;
        });

        if(have || section.Isfree||course.Isfree)
            return res.status(200).json({...section._doc,VideoToken,last:(idx-1>=0)?course.Sections[idx-1]:-1,next:(idx+1<course.Sections.length)?course.Sections[idx+1]:-1});
        else
            return res.status(400).json({msg:"الحصة ليست لديك"});
    }
    catch(e)
    {
        console.log(e);
    }
})



app.post("/delete",admin,async(req,res)=>{
    try{
    const {_id} =req.body;
        const codeExists = await Course.findOne({_id:_id});

        if(!codeExists)
        {
            res.status(400).json({msg:"الكود غير موجود"});
        return;
        }

        await Course.findOneAndDelete({_id:_id});

        res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})

app.post("/edit",admin,async(req,res)=>{
    try{
        const {_id,Name,Sections,Img,Private,Price,Isfree,Instructor} =req.body;
    
    if(!Name || !Sections ||!String(Price)||!String(Isfree)||!Img||!Instructor)
        return res.status(404).json({msg:"need data"});
        let time =Date.now ();


        if(Img.includes("data:image/*;base64,"))
        {
            var base64Data = Img.replace("data:image/*;base64,", "");
        
            require("fs").writeFile(__dirname+`/../imgs/${time}.png`, base64Data, 'base64', function(err) {
            console.log(err);
            });   
            //`/imgs/${time}.png`
        }

    const code = await Course.findByIdAndUpdate(_id,{
        Name:Name,
        Sections:Sections,
        Price:Price,
        Isfree:Isfree,
        Img:Img.includes("data:image/*;base64,")?`/imgs/${time}.png`:Img,
        Private:Private,
        Instructor:Instructor
    },{new:true});


    res.status(200).json("done");
    }
    catch(e)
    {
        console.log(e);
    }
})


module.exports = app;