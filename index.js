const express = require('express')
const bodyparser = require('body-parser')
const app = express();
const dotenv = require('dotenv')
const fs = require('fs');
const csv = require('csv-parser');
const mongoose =require('mongoose')
dotenv.config()
const port = process.env.PORT || 5000
app.get("/",(req,res)=>{
    res.send("hello")
})
csvpath = './IPL_Data.csv'
mongoose.connect('mongodb://localhost:27017/CricketDB1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error',(err)=>{
    console.log("Failed")
})
db.once('open',(err)=>{
    console.log("Connected Successsfully")
})
const crickSchema = new mongoose.Schema({
    Name:{
        type:String
    },
    Team:{
        type:String
    }
})
const Cricketmodel = mongoose.model('Cricketmodel', crickSchema);
const data = []
fs.createReadStream(csvpath)
  .pipe(csv())
  .on('data', (row) => {
    // Convert each row of CSV data to an object
    const item = {
        Name: row.Name,
        Team: row.Team
      
      // Add more columns as needed
    };
    data.push(item);
  })
  .on('end', () => {
    // Connect to the MongoDB 
    //console.log(data)
    Cricketmodel.insertMany(data)
        .then(function () {
        console.log("Successfully saved defult items to DB");
      })
      .catch(function (err) {
        console.log(err);
      });
  });
app.listen(port,function(){
    console.log(`Running at ${port}`)
})