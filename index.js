// Dependencies
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cors = require('cors');

// Express app initialization
const app = express();

// Middleware
const corsOptions = {
  origin: true, // Replace with the correct URL of your frontend
  credentials: true,
};


app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'hhrestaurantadminkey',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 60 * 60 * 1000
  }
}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Ajoutez cette ligne pour servir les fichiers statiques du dossier uploads

mongoose.connect('mongodb+srv://gamenotcreator:didou1234@webapp.mymezal.mongodb.net/application?retryWrites=true&w=majority', {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', () => console.log('Error in connecting to database'));
db.once('open', () => console.log('Connected to Database'));

// Import routes and configuration
const authRoutes = require('./routes/auth')(db);
const newsletterRoutes = require('./routes/newsletter')(db);
const postsRoutes = require('./routes/posts')(db);
const menuRoutes = require('./routes/menu')(db);

app.get("/", (req, res) => {
   return res.redirect("index.html");
});

app.get('/access_denied', function (req, res) {
   res.sendFile(path.join('./access_denied.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/menu', menuRoutes);

app.listen(3000, () => console.log('Server listening on port 3000'));