const   express     = require('express'),
        controller  = require('../models/controller'),
        router      = express.Router();

let routes = function() {

    router.route('/user')
        .get(controller.getUsers)
        .post(controller.addUser)
        

    router.route('/user/:id')
        .delete(controller.deleteUser)

    router.route('/userPermissions')
        .get(controller.getUserPermissions)

return router;

}

module.exports = routes;
