const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    name:{
        type:'String',
        required:true,
        trim: true,
    },
    salary:{
        type:'Number',
        required: true,
    },
    payPeriod:{
        type:'String',
        required: true,
    },
    startDate:{
        type:'Date',
        required: true,
    },
    dateOfBirth:{
        type:'Date',
        required:true,
    },
    payrollTax:{
        type:'Number',
        required:true,
    },
    businessId:{
        type:'String',
        required: true,
        trim: true,
    },
});
module.exports = mongoose.model('Employee', employeeSchema);