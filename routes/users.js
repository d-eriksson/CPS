const controller = require('../controllers/users');
const validateToken = require('../utils').validateToken;

module.exports = (router) => {
    router.route('/users')
        .get(validateToken, controller.getAll);
    router.route('/users/create')
        .post(validateToken, controller.add)
    router.route('/users/changePassword')
        .post(validateToken, controller.changePassword)
    router.route('/users/login')
        .post(controller.login);
    router.route('/users/remove')
        .post(validateToken, controller.remove);
    router.route('/users/me')
        .get(validateToken, controller.getMe);
    router.route('/users/byBusiness')
        .get(validateToken, controller.getByBusiness)
}