/**
 * Router for handling book management actions like adding, listing, updating, and deleting books.
 * All routes are protected by authentication middleware.
 * Certain actions (like adding, updating, and deleting books) require 'Admin' role access.
 */

const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { addBook, listBooks, updateBook, deleteBook } = require("../controllers/bookController");
const roleCheck = require("../middlewares/roleMiddleware");

const router = express.Router();

// Apply authentication middleware to all routes in this router
router.use(authMiddleware);

/**
 * POST /
 * Adds a new book to the library.
 * Only accessible to admin users.
 */
router.route('/')
   .post(roleCheck('Admin'), addBook)  // Admins can add a new book

   /**
    * GET /
    * Lists all books in the library.
    * Accessible to all authenticated users.
    */
   .get(listBooks);  // Authenticated users can list all books

/**
 * PUT /:id
 * Updates the details of an existing book.
 * Only accessible to admin users.
 * 
 * @param {string} id - The ID of the book to be updated.
 */
router.put('/:id', roleCheck('Admin'), updateBook);

/**
 * DELETE /:id
 * Deletes a book from the library.
 * Only accessible to admin users.
 * 
 * @param {string} id - The ID of the book to be deleted.
 */
router.delete('/:id', roleCheck('Admin'), deleteBook);

module.exports = router;
