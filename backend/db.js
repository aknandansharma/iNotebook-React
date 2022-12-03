const mongoose = require('mongoose')

const mongoURI =
  "mongodb://127.0.0.1:27017/inotebook?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0";

  const connectToMango = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connect to mongo Successfully")
    })
  }

  
  module.exports = connectToMango;