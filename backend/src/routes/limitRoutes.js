const express = require('express');
const { updateLimit } = require('../controllers/settingController');

const router = express.Router();

router.post('/', updateLimit);

module.exports = router;
