const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { addBook, listBooks, updateBook, deleteBook } = require("../controllers/bookController");
const roleCheck = require("../middlewares/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.route('/')
   .post(addBook)
   .get(listBooks);

router.put('/:id', updateBook);
router.delete('/:id', deleteBook)

module.exports = router;
