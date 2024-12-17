const express = require("express");
const router = express.Router();
const Sauce = require("../models/Sauce");
const jwt = require("jsonwebtoken");
const multer = require('multer');

const { hasSubscribers } = require("diagnostics_channel");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Customize filename
    },
  });
  
const upload = multer({ storage });

router.get("/sauces", async (req, res) => {
    try {
        const sauces = await Sauce.find();
        res.status(201).json(sauces);
    } 
    catch (error) {
        res.status(500).json({ error: "sauces failed" });
    }
});

router.get("/sauces/:id", async(req, res) =>{
    try {
        console.log(req.params);
        const sauces = await Sauce.find({_id: req.params.id});
        console.log(sauces[0]);
        res.status(201).json(sauces[0]);
    } 
    catch (error) {
        res.status(500).json({ error: "sauces failed" });
    }
});

router.post("/sauces", upload.single('image'), async(req, res) =>{
    try {
        img = req.file;
        const {name, manufacturer, description, mainPepper, heat} = JSON.parse(req.body.sauce);
        const sauce = new Sauce({userId:'', 
                                name, 
                                manufacturer,
                                description,
                                mainPepper,
                                imageUrl: 'http://localhost:3000/' + req.file.path,
                                heat,
                                likes:0, dislikes:0,
                                usersLiked:[], usersDisliked:[]});
        await sauce.save();
        res.status(201).json({message: 'sauce added successfully'});
    } 
    catch (error) {
        res.status(500).json({ error: "sauce addition failed" });
    }
});

router.delete("/sauces/:id", async(req, res) =>{
    try {
        Sauce.deleteOne({_id: req.params.id});
        res.status(201).json({message: 'sauce deleted successfully'});
    } 
    catch (error) {
        res.status(500).json({ error: "sauce deletion failed" });
    }
});

router.post("/sauces/:id/like", async(req, res) =>{
    try {
        console.log(req.params);
        console.log(req.body);
        if (req.body.like == 1){
            const sauce = await Sauce.findByIdAndUpdate(req.params.id, {likes:req.body.like});
        }
        else if (req.body.like == -1){
            const sauce = await Sauce.findByIdAndUpdate(req.params.id, {dislikes:req.body.like});
        }
        else{
            const sauce = await Sauce.findByIdAndUpdate(req.params.id, {likes:req.body.like, dislikes:req.body.like});
        }
        res.status(201).json({message: 'like status updated successfully'});
    } 
    catch (error) {
        res.status(500).json({ error: "sauces failed" });
    }
});

module.exports = router ;