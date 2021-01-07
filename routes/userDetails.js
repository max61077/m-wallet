const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const requireLogin = require('../middleware/requireLogin')
const {SENDGRID_API} = require('../config/keys')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(SENDGRID_API)

router.put('/update', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: {
            name: req.body.name,
            address: req.body.address
        }
    }, {new: true}).select('-password').then(result => {
        res.json(result)
    }).catch(err => {return res.status(422).json({error: err})})
})

router.delete('/delete', requireLogin, (req, res) => {
    User.findByIdAndDelete({_id: req.user._id})
    .then(result => {
        res.json({result})
    })
    .catch(err => {
        console.log(err)
    })
    
})

router.put('/addbalance', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: {balance: req.body.balance},
        $push: {transactions: {type: 'received', name: req.user.name, amt: req.body.addedAmt, time: req.body.time}}
    }, {
        new: true
    }).select('balance transactions')
    .exec((err, data) => {
        if(err)
            return res.status(422).json({error: err})
        res.json(data)
    })
})

router.put('/sendmoney', requireLogin, (req, res) => {
    User.findOne({phoneNo: req.body.phoneNo})
    .select('email name balance')
    .then(user => {
        if(!user)
            return res.status(422).json({error: "PhoneNo is not Registered with this App"})

        sgMail.send({
            to: user.email,
            from: {
                email: 'max61077@gmail.com',
                name: 'no-reply@m-wallet.com'
            },
            subject: "Amount Received",
            html: `<h2>${req.user.name} Sent You Rs.${req.body.sendAmount}</h2>`
        })

        User.findByIdAndUpdate(user._id, {
            $set: {balance: user.balance + req.body.sendAmount},
            $push: {transactions: {type: 'received', name: req.user.name, amt: req.body.sendAmount, time: req.body.time}}
        }, {
            new: true
        }).select('balance')
        .exec((err, data) => {
            if(err)
                return res.status(422).json({error: err})
        })

        User.findByIdAndUpdate(req.user._id, {
            $set: {balance: req.body.balance},
            $push: {transactions: {type: 'sent', name: user.name, amt: req.body.sendAmount, time: req.body.time}}
        }, {
            new: true
        }).select('balance transactions')
        .exec((err, data) => {
            if(err)
                return res.status(422).json({error: err})
            res.json(data)
        })
    }).catch(err => console.log(err))
})



module.exports = router