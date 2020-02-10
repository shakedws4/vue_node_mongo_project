const   express     = require('express'),
        controller  = require('../models/controller'),
        router      = express.Router();
        

let routes = function() {

    router.route('/user')
        .get(controller.getUsers)
        .post(controller.addUser)
        

    router.route('/user/:id')
        .delete(controller.deleteUser)


return router;

}

module.exports = routes;
