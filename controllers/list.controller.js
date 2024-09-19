import { List } from "../models/list.model.js";

export const getPublicLists = async (req, res) => {
     try {
          const lists = await List.find({ visibility: 'public' });
          res.status(200).json({ lists });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const getListsFromUser = async (req, res) => {
     const user = req.user;
     try {
          if (!user) {
               return res.status(404).json({ message: "User not found" });
          }
          const lists = await List.find({ userId: user._id });
          res.status(200).json({ lists });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const deleteList = async (req, res) => {
     const user = req.user;
     const { listName } = req.body;
     try {
          const list = await List.findOne({ name: listName, userId: user._id });
          if (!list) {
               return res.status(404).json({ message: "List not found", list });
          }

          if (listName === "favourites" || listName === "reading" || listName === "read" || listName === "to read") {
               return res.status(400).json({ message: "You can't delete this list" });
          }
          const deletedList = await List.findOneAndDelete({ name: listName, userId: user._id });
          res.status(200).json({ message: "List deleted successfully", deletedList });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const createList = async (req, res) => {
     const user = req.user;
     const { name } = req.body;
     try {
          const existingList = await List.findOne({ name, userId: user._id });
          if (existingList) {
               return res.status(400).json({ message: "List already exists" });
          }
          const list = await List.create({ name, userId: user._id });
          res.status(201).json({ message: "List created successfully", list });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}


// ********* BOOKS IN LISTS *********

export const getBooksFromList = async (req, res) => {
     const user = req.user;
     const { listName } = req.body;
     try {
          const list = await List.findOne({ name: listName, userId: user._id });
          res.status(200).json({ list });
     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const addBookToList = async (req, res) => {
     const user = req.user;
     const { bookId, listName } = req.body;

     try {
          // Check if the book is already in the list
          const isAdded = await List.findOne({ name: listName, userId: user._id, books: bookId });
          if (isAdded) {
               return res.status(400).json({ message: "Book already added to this list" });
          }

          // Add the book to the list
          const addition = await List.findOneAndUpdate(
               { name: listName, userId: user._id },
               { $push: { books: bookId } },
               { new: true }
          );

          res.status(200).json({
               message: "Book added to List successfully",
               list: addition
          });

     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}

export const deleteBookFromList = async (req, res) => {
     const user = req.user;
     const { bookId, listName } = req.body;

     try {
          // Check if the book is already in the list
          const isDeleted = await List.findOne({ name: listName, userId: user._id, books: bookId });
          if (!isDeleted) {
               return res.status(400).json({ message: "Book not found in this list" });
          }

          // Delete the book from the list
          const deletion = await List.findOneAndUpdate(
               { name: listName, userId: user._id },
               { $pull: { books: bookId } },
               { new: true }
          );

          res.status(200).json({
               message: "Book deleted from List successfully",
               list: deletion
          });

     } catch (error) {
          res.status(500).json({ message: "Internal Server Error" });
          console.log(error);
     }
}