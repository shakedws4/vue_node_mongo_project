const   express     = require('express'),
        controller  = require('../models/controller'),
        router      = express.Router();

let routes = function() {

    router.route('/test')
        .get(controller.getTests)
        .post(controller.addTest)
        

    router.route('/test/:id')
        .delete(controller.deleteTest)

    router.route('/user')
        .get(controller.getUserPermissions)

    router.route('/installers')
        .get(controller.getInstallers);

    router.route('/downloaders')
        .get(controller.getDownloaders);    

return router;

}

module.exports = routes;
