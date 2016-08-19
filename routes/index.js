var express = require('express');
var router = express.Router();
/* GET home page. */

require('./api')(router);



module.exports = router;
