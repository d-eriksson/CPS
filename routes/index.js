const users = require('./users');
const business = require('./business');
const employee = require('./employee');

module.exports = (router) =>{
    users(router);
    business(router);
    employee(router);
    return router;
}