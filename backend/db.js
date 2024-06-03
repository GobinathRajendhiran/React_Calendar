var mongoose = require('mongoose');

// initialize DB for mongoDB
const uri = "mongodb+srv://gobinathrajendhiran:860822%40Gobi@cluster0.6ha2utl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

var DB = mongoose.connect(uri).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.log(err)
})

module.exports = DB;