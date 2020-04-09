const controller = require('../controllers/business');

module.exports = (router) => {
    router.route('/business')
        .get(controller.getAll)
    router.route('/business/register')
        .post(controller.add)
}