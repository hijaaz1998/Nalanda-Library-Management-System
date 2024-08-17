const User = require("../models/User");
const Book = require("../models/Book");
const Borrow = require("../models/Borrow");

/**
 * Allows a user to borrow a book from the library.
*/

const borrowBook = async (req, res) => {
  try {
    const bookId = req.params.id; // Extract book ID from request parameters
    const userId = req.user.id;   // Extract user ID from authenticated user

    // Find the book by its ID
    const book = await Book.findById(bookId);

    // Check if the book exists and is available
    if (!book || book.availableCopies < 1) {
      return res.status(400).json({
        success: false,
        message: "Book not available",
      });
    }

    // Create a new borrow record
    const borrow = new Borrow({
      user: userId,
      book: bookId,
    });

    // Update the number of available copies
    book.availableCopies -= 1;

    // Save the borrow record and updated book information
    await borrow.save();
    await book.save();

    // Respond with success and updated book details
    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: book,
    });
  } catch (error) {
    console.error(error);
    // Respond with an internal server error
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Allows a user to return a borrowed book to the library.
*/

const returnBook = async (req, res) => {
  try {
    const bookId = req.params.id; // Extract book ID from request parameters
    const userId = req.user.id;   // Extract user ID from authenticated user

    // Find the borrow record for the specific book and user
    const borrow = await Borrow.findOne({ book: bookId, user: userId });

    // Check if the borrow record exists
    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found for this book and user",
      });
    }

    // Find the book by its ID
    const book = await Book.findById(bookId);

    // Check if the book exists
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Update the number of available copies and record the return date
    book.availableCopies += 1;
    borrow.returnDate = Date.now();

    // Save the updated borrow record and book information
    await borrow.save();
    await book.save();

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Book returned successfully",
    });
  } catch (error) {
    console.error(error);
    // Respond with an internal server error
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Retrieves the borrowing history of the authenticated user.
*/

const borrowHistory = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from authenticated user

    // Find all borrow records for the user, populate book details, and sort by creation date
    const history = await Borrow.find({ user: userId })
      .populate("book")
      .sort({ createdAt: -1 });

    // Respond with the user's borrowing history
    res.status(200).json({
      success: true,
      message: "Borrow history retrieved successfully",
      data: history,
    });
  } catch (error) {
    console.error(error);
    // Respond with an internal server error
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  borrowBook,
  returnBook,
  borrowHistory,
};
