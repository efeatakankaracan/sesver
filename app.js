const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoute');
const uploadRoute = require("./routes/uploadRoute")
const bodyParser = require("body-parser")



const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = `mongodb+srv://auth:XW2bv3B2igXP26QS@cluster0.vwr2yz4.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));


app.use(authRoutes);

app.use(bodyParser.text({ limit: "10mb"}))
app.use(uploadRoute)