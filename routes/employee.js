const controller = require('../controllers/employee');

const validateToken = require('../utils').validateToken;

module.exports = (router) => {
    router.route('/employee')
        .get(validateToken, controller.getAll)
    router.route('/employee/add')
        .post(validateToken, controller.add)
    router.route('/employee/costByYear')
        .get(validateToken, controller.getEmployeeCostByYear)
    router.route('/employee/costByMonth')
        .get(validateToken, controller.getEmployeeCostByMonth)
    router.route('/employee/remove')
        .post(validateToken, controller.remove)
}