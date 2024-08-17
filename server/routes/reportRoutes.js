/**
 * Router for handling admin reports related to books and members.
 * All routes are protected by authentication and require 'Admin' role access.
 */

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { mostBorrowedBooks, activeMembers, bookAvailability } = require('../controllers/reportController');
const roleCheck = require('../middlewares/roleMiddleware');

const router = express.Router();

// Apply authentication and role-checking middleware to all routes in this router
router.use(authMiddleware, roleCheck('Admin'));

/**
 * GET /most_borrowed
 * Returns a report of the most borrowed books in the library.
 * Only accessible to admin users.
 */
router.get('/most_borrowed', mostBorrowedBooks);

/**
 * GET /active_members
 * Returns a report of the most active members in the library.
 * Only accessible to admin users.
 */
router.get('/active_members', activeMembers);

/**
 * GET /book_availability
 * Returns a report on the availability of books in the library.
 * Only accessible to admin users.
 */
router.get('/book_availability', bookAvailability);

module.exports = router;
