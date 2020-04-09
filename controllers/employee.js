const mongoose = require('mongoose');
const Employee = require('../models/employee');

const connUri = process.env.MONGO_LOCAL_CONN_URL;

module.exports = {
    add: (req, res) => {
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) =>{
            let result = {};
            let status = 200;
            
            if(!err){
                const payload = req.decoded;
                if(payload && (payload.accessLevel ===1 || payload.accessLevel ===2)){
                    const {name, salary, payPeriod, startDate, dateOfBirth} = req.body;
                    let dob = new Date(dateOfBirth);
                    let currentYear = new Date();
                    let age = currentYear.getFullYear() - dob.getFullYear();
                    let payrollTax = 0.0;
                    if(age >= 83){
                        payrollTax =0.0;
                    }
                    else if(age >= 65 || (age <=16 )){
                        payrollTax = salary * 0.1021
                    }
                    else{
                        payrollTax = salary * 0.3142;
                    }
                    const employee = new Employee({name, salary, payPeriod,startDate: new Date(startDate),dateOfBirth: new Date(dateOfBirth), payrollTax: payrollTax, businessId: payload.businessId});
                    employee.save((err, employee) => {
                        if(!err){
                            result.status = status;
                            result.result = employee;
                        }else{
                            status = 500;
                            result.status = status;
                            result.error = err;
                        }
                        res.status(status).send(result);
                    })
                }else{
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
            
        });
    },
    remove: (req, res) => {
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) => {
            let result = {};
            let status = 200;
            const {employeeId} = req.body;
            if(!err){
                const payload = req.decoded;
                if(payload && payload.accessLevel ===1){
                    Employee.deleteOne({_id: employeeId, businessId: payload.businessId},(err, employee) => {
                        if(!err){
                            result.status = status;
                            result.result = employee;
                        } else{
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
    getAll: (req, res) =>{
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) =>{
            let result = {};
            let status = 200;
            if(!err){
                const payload = req.decoded;
                if(payload){
                    Employee.find({businessId: payload.businessId},(err,employees) =>{
                        if(!err){
                            result.status = status;
                            result.error = err;
                            result.result = employees;
                        }
                        else{
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
                
            }else{
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },
    getEmployeeCostByYear: (req, res) => {
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) => {
            let result = {};
            let status = 200;
            if(!err){
                const payload = req.decoded;
                if(payload){
                    Employee.find({businessId: payload.businessId}, (err, employees) => {
                        if(!err){
                            let totalCost = 0;
                            employees.forEach(employee => {
                                let cost = 0;
                                if(employee.payPeriod === "monthly"){
                                    cost = employee.salary*12;
                                } else if(employee.payPeriod === "yearly"){
                                    cost = employee.salary
                                } else if(employee.payPeriod === "weekly"){
                                    cost = employee.salary * 52
                                }
                                else if(employee.payPeriod === "biweekly"){
                                    cost = employee.salary * 26
                                }
                                totalCost += cost
                            });
                            result.result = {};
                            result.result.totalCost = totalCost;
                            result.status = status;
                            result.error = err;
                        } else{
                            status = 500;
                            result.status = 500;
                            result.error = err;
                        }
                        res.status(status).send(result);
                    });
                } else {
                    status = 401;
                    result.status = status;
                    result.error = `Authentication error`;
                    res.status(status).send(result);
                }
            } else{
                status=500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },
    getEmployeeCostByMonth: (req, res) => {
        mongoose.connect(connUri, {useNewUrlParser: true}, (err) => {
            let result = {};
            let status = 200;
            if(!err){
                const payload = req.decoded;
                if(payload){
                    Employee.find({businessId: payload.businessId}, (err, employees) => {
                        if(!err){
                            let totalCost = 0;
                            employees.forEach(employee => {
                                let cost = 0;
                                if(employee.payPeriod === "monthly"){
                                    cost = employee.salary;
                                } else if(employee.payPeriod === "yearly"){
                                    cost = employee.salary/12;
                                } else if(employee.payPeriod === "weekly"){
                                    cost = employee.salary * 4;
                                }
                                else if(employee.payPeriod === "biweekly"){
                                    cost = employee.salary * 2;
                                }
                                totalCost += cost
                            });
                            result.result = {};
                            result.result.totalCost = totalCost;
                            result.status = status;
                            result.error = err;
                        } else{
                            status = 500;
                            result.status = 500;
                            result.error = err;
                        }
                        res.status(status).send(result);
                    });
                } else {
                    status = 401;
                    result.status = status;
                    result.error = `Authentication error`;
                    res.status(status).send(result);
                }
            } else{
                status=500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    }
}