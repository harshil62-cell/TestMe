const express = require('express');
const { generateTest } = require('../controllers/test');
const validateToken = require('../middlewares/validateTokenHandler');

const router = express.Router();

router.post('/generate-test',validateToken,generateTest);


module.exports = router;