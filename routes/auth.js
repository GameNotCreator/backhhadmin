const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongoose').Types;
const cookieParser = require('cookie-parser');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const session = require('express-session');

router.use(cookieParser());
router.use(session({
  secret: 'hhrestaurantadminkey',
  resave: true,
  saveUninitialized: true
}));

const saltRounds = 10;

module.exports = (db) => {

   const transporter = nodemailer.createTransport({
      service: 'Outlook365', // Pour utiliser Outlook/Office365
      auth: {
        user: 'handh.corp@outlook.com', // Remplacez par votre adresse e-mail Outlook
        pass: 'Didou12+', // Remplacez par votre mot de passe Outlook
      },
    });

  function generateVerificationCode() {
   return crypto.randomBytes(4).toString("hex");
  }

   router.post("/login", (request, response) => {
      try {
         const email = request.body.email;
         const password = request.body.password;

         console.log(`${email} and ${password}`);

         db.collection('Auth').findOne({
            email: email
         }, (err, res) => {
            if (res === null) {
               return response.json({
                  error: "Informations not match. Please create account first"
               });
            } else if (err) throw err;

            // Utilisation de bcrypt pour comparer les mots de passe hachés
            bcrypt.compare(password, res.password, (error, result) => {
               if (error) {
                  console.log(error);
                  return response.json({
                     error: "Error occurred while comparing passwords"
                  });
               } else if (result === true) {
                  console.log("Login Successfully");
                
                  // Store user ID, role, first name and last name in the session
                  request.session.user = {
                    id: res._id.toString(),
                    role: res.role,
                    first_name: res.first_name,
                    last_name: res.last_name,
                  };
                
                  console.log("User ID:", res._id.toString());
                  console.log("User Role:", res.role);
                  console.log("User First Name:", res.first_name);
                  console.log("User Last Name:", res.last_name);
                
                  return response.json({
                    success: true, // Modify this line to indicate successful login
                  });
               } else {
                  console.log("Password not match");
                  return response.json({
                     error: "Wrong Password"
                  });
               }
            });
         })
      } catch (error) {
         console.log("Invalid information");
      }
   });

   router.post("/signup", (request, response) => {
      try {
        const firstname = request.body.firstName;
        const lastname = request.body.lastName;
        const email = request.body.email;
        const password = request.body.password;
        const restaurant = request.body.restaurant;
    
        // Ajustez la recherche pour vérifier à la fois l'e-mail et le restaurant
        db.collection('login').findOne({
          email: email,
          restaurant: restaurant // Ajoutez cette ligne
        }, (err, res) => {
          if (err) throw err;
          if (res) {
            return response.json({
              error: "Email already exists for this restaurant. Please use another email."
            });
          } else {
            const hashedPassword = bcrypt.hashSync(password, saltRounds);
    
            const data = {
              "first_name": firstname,
              "last_name": lastname,
              "email": email,
              "password": hashedPassword,
              "role": "client",
              "restaurant": restaurant,
            }
    
            db.collection('login').insertOne(data, (err, insertResult) => {
              if (err) throw err;
              response.cookie('user_id', insertResult.insertedId.toString(), {
                maxAge: 86400000,
                sameSite: 'strict'
              });
              response.cookie('user_role', 'client', {
                maxAge: 86400000,
                sameSite: 'strict'
              });
              console.log("Record insert Succesfully");
              return response.json({
                error: "",
                first_name: firstname,
                last_name: lastname
              });
            });            
          }
        })
    
      } catch (error) {
        console.log(error)
      }
    })
    
   // Récupérer les informations de profil
   router.get("/namedisplay", async (req, res) => {
      const userId = req.session.userId;
      const userRole = req.session.userRole;
      const user = await db.collection('auth').findOne({
         _id: new ObjectId(userId)
      });
      if (user) {
         delete user.password;

         res.json(user);
      } else {
         res.status(404).json({
            error: "User not found"
         });
      }
   });

   return router;
};
