const express = require('express');
let books = require("./booksdb.js");
const { authenticatedUser } = require('./auth_users.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// TASK 6
public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(400).json({message: "Error: Provide username and password"});
  }

  if(isValid(username)){
    let user = {"username": username, "password": password};
    users.push(user);
    return res.send(JSON.stringify({message: "Successfully created user: "+username}));
  } else {
    return res.status(400).json({message: "Error: Provide another username"});
  }
});

// TASK 1
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  return res.send(JSON.stringify(books,null,4));
});

// TASK 10
public_users.get('/books', async function (req, res) {
    const response = await axios.get('http://localhost:5000/');
    return res.send(response.data);
});

// TASK 2
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  const book = books[isbn];
  //console.log(isbn);
  if(book){
    return res.send(JSON.stringify(book));
  } else {
    return res.send(JSON.stringify({message: "No results with ISBN: "+isbn}));
  }
 });

 // TASK 11
public_users.get('/bookByIsnb/:isbn', async function (req, res) {
    const response = await axios.get('http://localhost:5000/isbn/'+req.params.isbn);
    return res.send(response.data);
});
  
 // TASK 3
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const allBooks = Object.values(books);
  const booksByAuthor = allBooks.filter(book => {return book.author.toLowerCase().includes(author.toLowerCase())});
  //return res.status(300).json({message: "Yet to be implemented"});
  if(booksByAuthor.length>0){
    return res.send(JSON.stringify(booksByAuthor));
  } else {
    return res.send(JSON.stringify({message: "No results with Author: "+author}));
  }
});

 // TASK 12
public_users.get('/booksByAuthor/:author', async function (req, res) {
    const response = await axios.get('http://localhost:5000/author/'+req.params.author);
    return res.send(response.data);
});

// TASK 4
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const title = req.params.title;
  const allBooks = Object.values(books);
  const booksByTitle = allBooks.filter(book => {return book.title.toLocaleLowerCase().includes(title.toLocaleLowerCase())});
  if(booksByTitle.length>0){
    return res.send(JSON.stringify(booksByTitle));
  } else {
    return res.send(JSON.stringify({message: "No results with Title: "+title}));
  }
});

 // TASK 13
public_users.get('/booksByTitle/:title', async function (req, res) {
    const response = await axios.get('http://localhost:5000/title/'+req.params.title);
    return res.send(response.data);
});

// TASK 5
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  const allBooks = Object.values(books);
  const reviewsByIsbn = books[isbn].reviews;
  const reviews = Object.values(reviewsByIsbn);
  if(reviews.length>0){
    return res.send(JSON.stringify(reviewsByIsbn,null,4));
  } else {
    return res.send(JSON.stringify({message: "No reviews for ISBN: "+isbn}));
  }
  //return res.status(300).json({message: "ERROR"});
});

module.exports.general = public_users;
