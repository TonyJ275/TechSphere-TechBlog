const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();

const port = process.env.PORT || 3000;

require('dotenv').config();

const connectDB = require('./server/models/database');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);


app.use(cookieParser('techBlogSecure'));
app.use(session({
  secret: 'techBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());



app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/blogRoutes.js');
app.use("/", routes);

// app.listen(port, () => console.log(`Listening to port ${port}`));
connectDB()
    .then(() => {
        app.listen(port, function () {
            console.log("Server started on port 3000");
        });
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error);
        process.exit(1);
    });
