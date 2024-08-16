const User = require("../models/User");
const Book = require("../models/Book");
const Borrow = require("../models/Borrow");

const borrowBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user;

    const book = await Book.findById(bookId);

    if (!book || book.availableCopies < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Book not available" });
    }

    const borrow = new Borrow({
      user: userId,
      book: bookId,
    });

    book.availableCopies -= 1;

    await borrow.save();
    await book.save();

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: book,
    });
  } catch (error) {
   console.log(error)
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

const returnBook = async (req, res) => {
  try {
    const borrowId = req.params.id;

    const borrow = await Borrow.findById(borrowId);

    if (!borrow) {
      return res.status(404).json({ msg: "Borrow record not found" });
    }

    const book = await Book.findById(borrow.book);

    book.availableCopies += 1;
    borrow.returnDate = Date.now();

    await borrow.save();
    await book.save();

    res
      .status(200)
      .json({ success: true, message: "Book returned successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

const borrowHistory = async (req, res) => {
  try {
    const userId = req.user;
    const history = await Borrow.find({ user: userId })
      .populate("book")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Borrow history retrieved successfully",
      data: history,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  borrowBook,
  returnBook,
  borrowHistory
};
