const mongoose = require('mongoose');
const Business = require('../models/business');
const User = require('../models/users');

const connUri = process.env.MONGO_LOCAL_CONN_URL;

module.exports = {
    add: (req, res) => {
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) =>{
            let result = {};
            let status = 200;
            if(!err){
                const {businessName, password, email} = req.body;
                let businessId;
                const business = new Business({name: businessName})
                business.save((err,business) => {
                    if(!err){
                        businessId = business._id;
                        const user = new User({name: 'admin', password, businessId, email, accessLevel: 1});
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
                        status = 500;
                        result.status = status;
                        result.error = err;
                        res.status(status).send(result)
                    }
                })
            }else{
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },
    getAll: (req, res) =>{
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) =>{
            let result = {};
            let status = 200;
            if(!err){
                Business.find({},(err,businesses) =>{
                    if(!err){
                        result.status = status;
                        result.error = err;
                        result.result = businesses;
                    }
                    else{
                        status = 500;
                        result.status = status;
                        result.error = err;
                    }
                    res.status(status).send(result);
                });
            }else{
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    }
}