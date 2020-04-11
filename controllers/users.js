const mongoose = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: process.env.SERVICE_EMAIL,
           pass: process.env.SERVICE_EMAIL_PASSWORD,
       }
});

const connUri = process.env.MONGO_LOCAL_CONN_URL;

module.exports = {
    add: (req,res) =>{
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) => {
            let result = {};
            let status = 200;
           
            if(!err){

                const payload = req.decoded;
                if(payload && payload.accessLevel===1){
                    console.log(process.env.SERVICE_EMAIL);
                    console.log(process.env.SERVICE_EMAIL_PASSWORD);
                    const {name, password, email, accessLevel} = req.body;
                    const mailOptions = {
                        from: process.env.SERVICE_EMAIL, // sender address
                        to: email, // list of receivers
                        subject: 'You have been invited to join CPS', // Subject line
                        html: '<p>This is your temporary password: '+ password +'</p>'// plain text body
                    };
                    transporter.sendMail(mailOptions, function (err, info) {
                        if(err)
                          console.error(err)
                        else
                          console.log(info);
                    });
                    const user = new User({name, password, businessId: payload.businessId, email, accessLevel});
    
                    user.save((err,user)=>{
                        if(!err){
                            result.status = status;
                            result.result = user;
                        }else{
                            status = 500;
                            result.status = status;
                            result.error = err;
                        }
    
                        res.status(status).send(result);
                    });
                }else{
                    status = 401;
                    result.status = status;
                    result.error = `Authentication error`;
                    res.status(status).send(result);
                }

            } else{
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        })
    },
    remove: (req, res) =>{
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) => {
            const {email} = req.body;
            let result = {};
            let status = 200;
            if(!err){
                const payload = req.decoded;
                if(payload && payload.accessLevel==1){
                    User.deleteOne({email, businessId:payload.businessId},(err,user) => {
                        if(!err){
                            result.status = status;
                            result.result = user;
                        } else{
                            status = 500;
                            result.status = status;
                            result.error = err;
                        }
                        res.status(status).send(result);
                        
                    })
                } else{
                    status = 401;
                    result.status = status;
                    result.error = `Authentication error`;
                    res.status(status).send(result);
                }
            }
            else{
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        })

    },
    changePassword: (req, res) => {
        mongoose.connect(connUri, {useNewUrlParser: true}, (err)=>{
            let result = {}
            let status = 200;
            if(!err){
                const {newPassword} = req.body;
                const payload = req.decoded;
                if(payload){
                    User.findOne({email:payload.email},(err, user)=> {
                        if(!err && user){
                            user.password = newPassword;
                            user.save((err,user)=>{
                                if(!err){
                                    result.status = status;
                                    result.result = user;
                                }else{
                                    status = 500;
                                    result.status = status;
                                    result.error = err;
                                }
            
                                res.status(status).send(result);
                            });
                        } else{
                            status = 404;
                            result.status = status;
                            result.error = err;
                            res.status(400).send(result);
                        }
                        
                    });
                } else{
                    status = 401;
                    result.status =status;
                    result.error = 'Authentication error';
                }
            }
            else{
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
            
        })
    },
    login: (req, res)=>{
        const {email, password} = req.body;
        console.log(password);
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) => {
            let result = {};
            let status = 200;
            if(!err){
                User.findOne({email},(err,user) => {
                    if(!err && user){
                        bcrypt.compare(password, user.password).then(match =>{
                            if(match){
                                const payload = {
                                    name: user.name,
                                    email: user.email,
                                    businessId: user.businessId,
                                    accessLevel: user.accessLevel,
                                };
                                const options = {expiresIn:'2d', issuer:'cps'}
                                const secret = process.env.JWT_SECRET;
                                const token = jwt.sign(payload, secret, options);

                                result.token = token;
                                result.status = status;
                                result.result = user;
                            }
                            else{
                                status = 401;
                                result.status =status;
                                result.error = 'Authentication error';
                            }
                            res.status(status).send(result);
                        }).catch(err => {
                            status = 500;
                            result.status = status;
                            result.error = err;
                            res.status(status).send(result);
                        });
                    } else{
                        status = 404;
                        result.status = status;
                        result.error = err;
                        res.status(400).send(result);
                    }
                });
            } else{
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },
    getAll: (req, res) => {
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) => {
            let result = {};
            let status = 200;
            if(!err){
                const payload = req.decoded;
                if(payload && payload.accessLevel===0){
                    User.find({}, (err, users) => {
                        if(!err){
                            result.status = status;
                            result.error = err;
                            result.result = users;
                        }else{
                            status = 500;
                            result.status = status;
                            result.error = err;
                        }
                        res.status(status).send(result);
                    });
                } else{
                    status = 401;
                    result.status = status;
                    result.error = `Authentication error`;
                    res.status(status).send(result);
                }
            } else{
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },
    getMe: (req, res) => {
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) => {
            let result = {}
            let status = 200;
            if(!err){
                const payload = req.decoded;
                if(payload){
                    User.findOne({email: payload.email}, (err, user) => {
                        if(!err){
                            result.status = status;
                            result.error = err;
                            result.result = user;
                        }else{
                            status = 500;
                            result.status = status;
                            result.error = err;
                        }
                        res.status(status).send(result);
                    });
                } else{
                    status = 401; 
                    result.status = status;
                    result.error = `Authentication error`;
                    res.status(status).send(result);
                }
            }
        })
    },
    getByBusiness: (req, res) => {
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) => {
            let result = {}
            let status = 200;
            if(!err){
                const payload = req.decoded;
                if(payload ){
                    User.find({businessId: payload.businessId}, (err, user) => {
                        if(!err){
                            result.status = status;
                            result.error = err;
                            result.result = user;
                        }else{
                            status = 500;
                            result.status = status;
                            result.error = err;
                        }
                        res.status(status).send(result);
                    });
                } else{
                    status = 401; 
                    result.status = status;
                    result.error = `Authentication error`;
                    res.status(status).send(result);
                }
            }
        })
    },
}