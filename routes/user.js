const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = mongoose.model('User')

router.put('/update/:id',(req,res)=>{

    if (req.body.password) {
        bcrypt.hash(req.body.password,12)
        .then(hashedPassword=>{
            req.body.password=hashedPassword
            User.findByIdAndUpdate({_id:req.params.id},req.body)
            .select("-password")
            .then(result=>res.status(200).send(result))
            .catch(err=>res.status(422).json({error:err}))
        })
    }else{
        User.findByIdAndUpdate({_id:req.params.id},req.body)
        .select("-password")
        .then(result=>res.status(200).send(result))
        .catch(err=>res.status(422).json({error:err}))
    }
}) 

router.delete('/delete/:id',(req,res)=>{
    User.findByIdAndDelete({_id:req.params.id})
    .then(result =>res.status(200).send(result))
    .catch(err=>res.status(422).json({error:err}))
})

module.exports = router