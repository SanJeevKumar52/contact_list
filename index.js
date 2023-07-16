
const express = require('express');
const path = require('path');
const port = 8000;

const db = require('./config/mongoose');
const Contact = require('./models/contact');

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse the request body
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'assets' directory
app.use(express.static('assets'));

// Temporary contact list (before integrating with database)
var contactList = [
    {
        name: "Arpan",
        phone: "1111111111"
    },
    {
        name: "Tony Stark",
        phone: "1234567890"
    },
    {
        name: "Coding Ninjas",
        phone: "12131321321"
    }
]

// Route for the practice page
app.get('/practice', function (req, res) {
    return res.render('practice', {
        title: "Let us play with ejs"
    });
});

// Route for the home/contact list page
app.get('/', function (req, res) {
    // Fetch all contacts from the database
    Contact.find({}, function(err, contacts){
        if(err){
            console.log('Error in fetching contacts from the database');
            return;
        }
        // Render the home view with the fetched contacts
        return res.render('home', {
            title: "Contact List",
            contact_list: contacts
        });
    }); 
});

// Route to create a new contact
app.post('/create-contact', function (req, res) {
    // Create a new contact in the database
    Contact.create({
        name: req.body.name,
        phone: req.body.phone
    }, function (err, newContact) {
        if (err) {
            console.log('Error in creating a contact');
            return;
        }
        console.log('New Contact:', newContact);
        // Redirect back to the previous page
        return res.redirect('back');
    });
});

// Route to delete a contact
app.get('/delete-contact', function (req, res) {
    let id = req.query.id;
    // Find and delete the contact from the database
    Contact.findByIdAndDelete(id, function(err){
        if(err){
            console.log('Error in deleting an object from the database');
            return;
        }
        // Redirect back to the previous page
        return res.redirect('back');
    });
});

// Start the server
app.listen(port, function (err) {
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Server is running on Port', port);
});
