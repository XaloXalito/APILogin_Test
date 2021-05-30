const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')

router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body
    if (!email || !password || !name) {
        return res.status(422).json({error: 'Por favor no dejar casillas en blanco.'})
    }
    User.findOne({email:email.toLowerCase()})
    .then(savedUser=>{
        if (savedUser) {
            return res.status(422).json({error:'Ya existe un usuario con ese correo'})
        }else{
            bcrypt.hash(password,12)
            .then(hashedPassword=>{
                const user = new User({
                    email:email.toLowerCase(),
                    password:hashedPassword,
                    name
                })
                user.save()
                .then(user=>res.status(200).send(user))
                .catch(err=>console.log(err))
            })
        }
    })
    .catch(err=>console.log(err))
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email,!password){
        return res.status(422).json({error:'No deje campos en blanco.'})
    }
    User.findOne({email:email.toLowerCase()})
    .then(savedUser =>{
        if (!savedUser) {
            return res.status(422).json({error:'El correo o la contraseña son incorrectas.'})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if (doMatch) {
                //res.json({message:'Se inicio sesion correctamente.'})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET,{expiresIn: (60 * 60) * (24 * 7)})
                const {_id, name, email} = savedUser
                res.json({token,user:{_id, name, email}})
            }else{
                return res.status(422).json({error:'El correo o la contraseña son incorrectos.'})
            }
        })
        .catch(err=>console.log(err))
    })
})

module.exports = router