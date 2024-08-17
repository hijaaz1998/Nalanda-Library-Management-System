const Book = require("../models/Book");

/**
 * Adds a new book to the library.
*/

const addBook = async (req, res) => {
  try {
    const { title, author, ISBN, publicationDate, genre, numberOfCopies } =
      req.body;

    // Create a new book instance
    let book = new Book({
      title,
      author,
      ISBN,
      publicationDate,
      genre,
      numberOfCopies,
      availableCopies: numberOfCopies, // Initially, all copies are available
    });

    // Save the new book to the database
    await book.save();

    // Respond with success and the newly added book details
    res.status(201).json({
      success: true,
      message: "Book added successfully",
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
 * Retrieves a paginated list of books, with optional filters.
*/

const listBooks = async (req, res) => {
  try {
    // Extract pagination and filter parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { genre, author } = req.query;

    // Build the query with optional filters
    const query = { isDeleted: false };

    if (genre) query.genre = genre;
    if (author) query.author = author;

    // Fetch books with pagination and filters
    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    // Respond with the list of books
    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
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
 * Updates the details of an existing book.
*/

const updateBook = async (req, res) => {
  try {
    const { title, author, ISBN, publicationDate, genre, numberOfCopies } =
      req.body;

    // Find the book by ID
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Update book details
    book.title = title || book.title;
    book.author = author || book.author;
    book.ISBN = ISBN || book.ISBN;
    book.publicationDate = publicationDate || book.publicationDate;
    book.genre = genre || book.genre;
    book.numberOfCopies = numberOfCopies || book.numberOfCopies;
    book.availableCopies = numberOfCopies || book.availableCopies;

    // Save the updated book to the database
    await book.save();

    // Respond with success and the updated book details
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
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
 * Marks a book as deleted (soft delete).
*/

const deleteBook = async (req, res) => {
  try {
    // Find the book by ID
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Mark the book as deleted
    book.isDeleted = true;

    // Save the updated book to the database
    await book.save();

    // Respond with success
    res.json({
      success: true,
      message: "Book deleted",
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
  addBook,
  listBooks,
  updateBook,
  deleteBook,
};
