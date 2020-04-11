const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:'String',
        required:true,
        trim: true,
    },
    password:{
        type:'String',
        required: true,
        trim: true,
    },
    businessId:{
        type:'String',
        required: true,
        trim: true,
    },
    email:{
        type:'String',
        required: true,
        trim: true,
        unique: true,
    },
    accessLevel:{
        type:'Number',
        required: true,
    }
});
userSchema.pre('save', function(next){
    const user = this;
    bcrypt.hash(user.password, stage.saltingRounds, function(err, hash){
        if(err){
            console.log('Error hashing password for user', user.email);
            next(err);
        }else{
            user.password = hash;
            next();
        }
    });
});

module.exports = mongoose.model('User', userSchema);