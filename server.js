const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
    res.render('index'); // Render the index.ejs template
});

// Define routes
app.get('/about', (req, res) => {
    res.render('about'); // Render the index.ejs template
});

app.get('/projects', (req, res) => {
    const projects = [
        { link: 'project1.html', image: 'https://via.placeholder.com/200x250' },
        { link: 'project2.html', image: 'https://via.placeholder.com/200x250' },
        { link: 'project3.html', image: 'https://via.placeholder.com/200x250' }
    ];
    res.render('projects', { projects }); // Render the projects.ejs template with the projects data
});

app.get('/project1', (req, res) => {
    res.render('project1');
});

app.get('/project2', (req, res) => {
    res.render('project2');
});

app.get('/project3', (req, res) => {
    res.render('project3');
});

app.get('/project4', (req, res) => {
    res.render('project4');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
