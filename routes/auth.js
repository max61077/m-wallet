const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET, SENDGRID_API} = require('../config/keys');
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(SENDGRID_API)

router.post('/signup', (req, res) => {
    const {name, email, password, phoneNo, address} = req.body;

    if(!email || !password || !name || !phoneNo || !address)
        return res.status(422).json({error: "Please add all the fields"})

    User.findOne({email: email})
    .then(savedUser => {
        if(savedUser)
            return res.status(422).json({error: "User Already exists"})

        bcrypt.hash(password, 12)
        .then(hashpassword => {
            const user = new User({
                email,
                password:hashpassword,
                name,
                phoneNo,
                address
            })
    
            user.save()
            .then(user => {
                sgMail.send({
                    to: user.email,
                    from: {
                        email: 'max61077@gmail.com',
                        name: 'no-reply@m-wallet.com'
                    },
                    subject: "SignUp Success",
                    html: "<h1>Welcome to M-Wallet</h1>"
                })
                res.json({message: "Saved Successfully"})
            })
            .catch(err => {
                console.log(err)
            })
    
        })
        
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/signin', (req, res) => {
    const {email, password} = req.body

    if(!email || !password)
        return res.status(422).json({error: "Please fill all the fields"})

    User.findOne({email: email})
    .then(savedUser => {
        if(!savedUser)
           return res.status(422).json({error: "Invalid username or password"})

        bcrypt.compare(password, savedUser.password)
        .then(matched => {
            if(matched){
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                const {_id, name, email, phoneNo, address, balance, transactions}  = savedUser
                res.json({token, user: {_id, name, email, phoneNo, address, balance, transactions}})
            }
            else
                return res.status(422).json({error: "Invalid username or password"})
        })
        .catch(err => {
            console.log(err)
        })

    })
})


module.exports = router;