const express = require('express');
const lendController = require('../controllers/lendController');

const router = express.Router();

router.post('/', lendController.addLendEntry);
router.get('/', lendController.listLendEntries);
router.get('/summary', lendController.getLendSummary);
router.patch('/:id', lendController.returnLendEntry);

module.exports = router;
