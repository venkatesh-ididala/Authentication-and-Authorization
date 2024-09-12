# Mongoose Models, Authentication, and Authorization Setup

This repository provides a basic setup for using Mongoose to manage MongoDB models and implement authentication and authorization in a Node.js application using JWT (JSON Web Tokens).

# Features

 -User Authentication: Sign up, login, and protected routes using JWT.
- Authorization: Protect routes based on user roles.
- Mongoose Models: Schemas and models for MongoDB using Mongoose.
- Environment Configuration: Use of `.env` file for environment-specific settings.

# Prerequisites

- Node.js: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- MongoDB: Install and run MongoDB, or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Postman API: Postman is a popular tool for API development that allows you to create, test, and share HTTP requests.You can download it from (postman.com).


 # Set up environment variables

    Create a `.env` file in the root directory and add the following:

    MONGO_URI=your_mongodb_connection_string
    SECRET_STR=your_jwt_secret
    LOGIN_EXPIRES_IN=30d
    PORT=3000
  

# Run the Application

To start the server, run:
npm start

# Dependencies 

* Json Web Token
-npm install Jsonwebtoken

