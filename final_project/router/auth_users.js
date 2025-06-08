const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let match = users.filter((user) => {return user.username===username; });
  if( match.length>0 ){
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records
  let match = users.filter((user) => {return (user.username===username && user.password===password); });
  if( match.length>0 ){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(400).json({message: "Error: Provide username and password"});
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({"username": username}, 'access', {expiresIn: 60*60});
    req.session.autorization={accessToken, username};
    req.session.username=username;
    req.session.accessToken=accessToken;
    console.log("LOGIN TOKEN "+req.session.autorization.username);
    return res.status(200).send("Successfully logged in user: "+username);
  } else {
    return res.status(400).json({message: "Error: Invalid user credentials"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.username;
  const newReview = req.body.review;
  const review = {"user": username, "review": newReview};
  
  if(!books[isbn] || !newReview){
    return res.status(400).json({message: "Error: Invalid request"});
  } else {
    const reviews = books[isbn].reviews;
    
    for(const reviewID in reviews){
        if(reviews[reviewID].user===username){
            newReviewID=reviewID;
        }
    }

    if(!newReviewID){
        const newReviewID = Object.keys(reviews).length > 0 ? Math.max(...Object.keys(reviews).map(Number)) + 1 : 1;
    }

    reviews[newReviewID] = review;
    return res.status(200).send("Successfully added review");
  }

  
  //return res.status(300).json({message: "Yet to be implemented"});
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;

    if(!books[isbn]){
        return res.status(400).json({message: "Error: Invalid request"});
    } else {
        const reviews = books[isbn].reviews;

        for(const reviewID in reviews){
            if(reviews[reviewID].user===username){
                delete reviews[reviewID];
                return res.status(200).send("Successfully deleted review");
            }
        }
    }
    return res.status(200).send("No reviews found for user")
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
