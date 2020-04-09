const mongoose = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const connUri = process.env.MONGO_LOCAL_CONN_URL;

module.exports = {
    add: (req,res) =>{
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) => {
            let result = {};
            let status = 200;
           
            if(!err){

                const payload = req.decoded;
                if(payload && payload.accessLevel===1){
                    const {name, password, email, accessLevel} = req.body;
                    // TODO: generate a random password and email the new client and have them change password.
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
    login: (req, res)=>{
        const {email, password} = req.body;

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
                if(payload && payload.email ==='admin@mail.se'){
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