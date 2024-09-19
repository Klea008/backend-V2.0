import { Book } from '../models/book.model.js';

/******* PUBLIC ROUTES *********/

export const getBooks = async (req, res) => {
     try {
          const { genre, pages, year, rating, search } = req.query;

          let query = {
               ...(genre && { genre }),
               ...(pages && { pages }),
               ...(year && { year }),
               ...(rating && { rating }),
               ...(search && { title: { $regex: search, $options: "i" } })
          }

          const page = Number(req.query.pageNumber) || 1;
          const limit = Number(req.query.limit) || 10;
          const skip = (page - 1) * limit;

          const books = await Book.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

          const count = await Book.countDocuments(query);

          res.json({
               books,
               page,
               pages: Math.ceil(count / limit),
               totalBooks: count
          })
     } catch (error) {
          res.status(500).json({ message: "Internal server error" })
          console.error(error)
     }
}

export const getBookById = async (req, res) => {
     const { id } = req.params
     try {
          const book = await Book.findById(id);
          if (book) {
               res.status(200).json({ message: "Book has been retrieved", book });
          } else {
               res.status(404).json({ message: "Book not found" });
          }
     } catch (error) {
          res.status(500).json({ message: "Internal server error" })
          console.error(error)
     }
}

export const getTopRatedBooks = async (req, res) => {
     try {
          const topRatedBooks = await Book.find().sort({ rating: -1 });
          res.status(200).json({ message: "Top rated books have been retrieved", topRatedBooks });

     } catch (error) {
          res.status(500).json({ message: "Internal server error" })
          console.error(error)
     }
}

// TO SUGGEST OTHER BOOKS ON THE BOOK DETAILS PAGE
export const getRandomBooks = async (req, res) => {
     try {
          const randomBooks = await Book.aggregate([
               { $sample: { size: 4 } }    // Randomly sample 10 books
          ]);

          res.status(200).json({ message: "Random books have been retrieved", randomBooks });
     } catch (error) {
          res.status(500).json({ message: "Internal server error" });
          console.error(error);
     }
};


/*********** ADMIN BOOKS CONTROLLERS *************/

// ADD MANY BOOKS AT ONCE
export const importBooks = async (req, res) => {
     try {
          const books = await Book.insertMany(req.body);
          res.status(201).json({ message: "Books imported successfully", books });
     } catch (error) {
          res.status(500).json({ message: "Internal server error" })
          console.error(error)
     }
}

export const createBook = async (req, res) => {
     const { title, author, description, image, pages, year, originalLanguage, genre } = req.body;
     if (!title || !author || !description || !pages || !year || !genre) {
          return res.status(400).json({ message: "Please fill all the fields" });
     }
     try {
          const book = await Book.findOne({ title });
          if (book) {
               return res.status(400).json({ message: "Book already exists" });
          }

          const newBook = new Book({
               title, author, description, image, pages, year, originalLanguage, genre
          });
          const createdBook = await newBook.save();
          res.status(201).json({ message: "Book created successfully", createdBook });
     } catch (error) {
          res.status(500).json({ message: "Internal server error" });
          console.error(error);
     }
}

export const updateBook = async (req, res) => {
     const { id } = req.params
     const { title, author, description, image, pages, year, originalLanguage } = req.body;
     try {
          const book = await Book.findById(id);
          if (book) {
               book.title = title || book.title;
               book.author = author || book.author;
               book.description = description || book.description;
               book.image = image || book.image;
               book.pages = pages || book.pages;
               book.year = year || book.year;
               book.originalLanguage = originalLanguage || book.originalLanguage;
               const updatedBook = await book.save();
               res.status(200).json({ message: "Book updated successfully", updatedBook });
          } else {
               res.status(404).json({ message: "Book not found" });
          }
     } catch (error) {
          res.status(500).json({ message: "Internal server error" })
          console.error(error)
     }
}

export const deleteBook = async(req, res) => {
     const { id } = req.params
     try {
          const book = await Book.findById(id);
          if (book) {
               const deletedBook = await book.remove();
               res.status(200).json({ message: "Book deleted successfully", deletedBook });
          } else {
               res.status(404).json({ message: "Book not found" });
          }
     } catch (error) {
          res.status(500).json({ message: "Internal server error" });
          console.error(error);
     }
}

export const deleteAllBooks = async (req, res) => {
     try {
          const deletedBooks = await Book.deleteMany();  // Await the result
          res.status(200).json({ message: "All books deleted successfully", deletedBooks });
     } catch (error) {
          res.status(500).json({ message: "Internal server error" });
          console.error(error);
     }
};