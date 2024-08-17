const Book = require("../models/Book");
const User = require("../models/User");
const Borrow = require("../models/Borrow");

/**
 * Retrieves the top 10 most borrowed books.
*/

const mostBorrowedBooks = async (req, res) => {
  try {
    // Aggregate borrow records to find the most borrowed books
    const mostBorrowed = await Borrow.aggregate([
      // Group by book ID and count the number of times each book is borrowed
      { $group: { _id: "$book", count: { $sum: 1 } } },
      // Sort the books by borrow count in descending order
      { $sort: { count: -1 } },
      // Limit to the top 10 most borrowed books
      { $limit: 10 },
      // Lookup detailed information about the books
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      // Unwind the book details array to flatten the data structure
      { $unwind: "$book" },
    ]);

    // Respond with the list of most borrowed books
    res.json(mostBorrowed);
  } catch (err) {
    console.error(err.message);
    // Respond with an internal server error if something goes wrong
    res.status(500).send("Server error");
  }
};

/**
 * Retrieves the top 10 active members based on the number of borrowed books.
*/

const activeMembers = async (req, res) => {
  try {
    // Aggregate borrow records to find the most active members
    const activeMembers = await Borrow.aggregate([
      // Group by user ID and count the number of borrow records per user
      { $group: { _id: "$user", borrowCount: { $sum: 1 } } },
      // Sort users by borrow count in descending order
      { $sort: { borrowCount: -1 } },
      // Limit to the top 10 active members
      { $limit: 10 },
      // Lookup detailed information about the users
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      // Unwind the user details array to flatten the data structure
      { $unwind: "$user" },
    ]);

    // Respond with the list of active members
    res.json(activeMembers);
  } catch (err) {
    console.error(err.message);
    // Respond with an internal server error if something goes wrong
    res.status(500).send("Server error");
  }
};

/**
 * Retrieves information about book availability, including borrowed and available copies.
*/

const bookAvailability = async (req, res) => {
  try {
    // Aggregation pipeline to get borrowed books details
    const borrowedBooksAggregation = [
      // Match records where returnDate is null (i.e., books not yet returned)
      { $match: { returnDate: null } },
      // Group by book ID and count the number of times each book is borrowed
      { $group: { _id: "$book", borrowedCount: { $sum: 1 } } },
      // Lookup detailed information about the books
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      // Unwind the book details array to flatten the data structure
      { $unwind: "$bookDetails" },
      // Project relevant fields for the response
      {
        $project: {
          _id: 0,
          bookId: "$_id",
          title: "$bookDetails.title",
          author: "$bookDetails.author",
          ISBN: "$bookDetails.ISBN",
          borrowedCount: "$borrowedCount",
        },
      },
    ];

    // Get details of borrowed books
    const borrowedBooksDetails = await Borrow.aggregate(borrowedBooksAggregation);

    // Aggregation pipeline to get total book availability details
    const totalBooksAggregation = [
      // Match records where books are not marked as deleted
      { $match: { isDeleted: false } },
      // Lookup the count of borrowed books for each book
      {
        $lookup: {
          from: "borrows",
          let: { bookId: "$_id" },
          pipeline: [
            // Match borrow records for the current book ID where returnDate is null
            { $match: { $expr: { $eq: ["$book", "$$bookId"] }, returnDate: null } },
            // Count the number of borrow records
            { $count: "borrowedCount" },
          ],
          as: "borrowDetails",
        },
      },
      // Add fields for borrowed count and available copies
      {
        $addFields: {
          borrowedCount: { $arrayElemAt: ["$borrowDetails.borrowedCount", 0] },
          availableCopies: { 
            $subtract: ["$numberOfCopies", { $ifNull: [{ $arrayElemAt: ["$borrowDetails.borrowedCount", 0] }, 0] }] 
          },
        },
      },
      // Project relevant fields for the response
      {
        $project: {
          title: 1,
          author: 1,
          ISBN: 1,
          totalCopies: "$numberOfCopies",
          borrowedCount: { $ifNull: ["$borrowedCount", 0] },
          availableCopies: 1,
          availability: { $cond: { if: { $gt: ["$availableCopies", 0] }, then: "Available", else: "Not Available" } },
        },
      },
    ];

    // Get details of all books with their availability
    const booksWithDetails = await Book.aggregate(totalBooksAggregation);

    // Respond with details of total books, borrowed books, and available books
    res.json({
      totalBooks: booksWithDetails,
      borrowedBooks: borrowedBooksDetails,
      availableBooks: booksWithDetails.filter((book) => book.availableCopies > 0),
    });
  } catch (err) {
    console.error(err.message);
    // Respond with an internal server error if something goes wrong
    res.status(500).send("Server error");
  }
};

module.exports = {
  mostBorrowedBooks,
  activeMembers,
  bookAvailability,
};
