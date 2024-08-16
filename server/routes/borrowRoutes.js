const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { borrowBook, returnBook, borrowHistory } = require('../controllers/borrowController');

const router = express.Router();

router.use(authMiddleware);

router.post('/:id', borrowBook);
router.post('/return/:id', returnBook);
router.post('/history', borrowHistory);


module.exports = router