const Book = require("../models/Book");

const addBook = async (req, res) => {
  try {
    const { title, author, ISBN, publicationDate, genre, numberOfCopies } =
      req.body;

    let book = new Book({
      title,
      author,
      ISBN,
      publicationDate,
      genre,
      numberOfCopies,
      availableCopies: numberOfCopies,
    });

    await book.save();
    res
      .status(201)
      .json({ success: true, message: "Book added successfully", data: book });
  } catch (error) {
   console.log(error)
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

const listBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { genre, author } = req.query;

    const query = { isDeleted: false };

    if (genre) query.genre = genre;
    if (author) query.author = author;

    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

const updateBook = async (req, res) => {
  try {
    const { title, author, ISBN, publicationDate, genre, numberOfCopies } =
      req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.ISBN = ISBN || book.ISBN;
    book.publicationDate = publicationDate || book.publicationDate;
    book.genre = genre || book.genre;
    book.numberOfCopies = numberOfCopies || book.numberOfCopies;
    book.availableCopies = numberOfCopies || book.availableCopies;

    await book.save();
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

const deleteBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({success: false, message: 'Book not found'});
    }
    book.isDeleted = true;

    await book.save();
    res.json({success: true, message: 'Book deleted'});
  } catch (error) {
   res.status(500).json({ success: false, message: "internal server error" });
  }
};

module.exports = {
  addBook,
  listBooks,
  updateBook,
  deleteBook
};
