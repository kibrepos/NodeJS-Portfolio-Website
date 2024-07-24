const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'Foodlist';
const collectionName = 'Dishes';

let db;

// Connect to the database
async function connectToDatabase() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        db = client.db(dbName);
        console.log(`Connected to database: ${dbName}`);
    } catch (error) {
        console.error('Error connecting to database:', error);
        db = null;
    }
}

async function checkDatabaseConnection() {
    if (!db) {
        console.warn('Warning: Unable to connect to the MongoDB database. Please ensure MongoDB is running.');
        return false;
    }
    return true;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');



// Routes for Food Inventory System

app.get('/project5', async (req, res) => {
    if (!await checkDatabaseConnection()) {
        return res.status(500).send('Internal Server Error: Unable to connect to the database.');
    }

    try {
        const dishes = await db.collection(collectionName).find().toArray();

        // Calculate gross profit
        const grossProfit = dishes.reduce((acc, item) => {
            const profitPerDish = item.price ? item.price * item.soldDishes : 0;
            return acc + profitPerDish;
        }, 0);

        res.render('project5', { foodItems: dishes, grossProfit });
    } catch (error) {
        console.error('Error fetching dishes:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/add', async (req, res) => {
    if (!await checkDatabaseConnection()) {
        return res.status(500).send('Internal Server Error: Unable to connect to the database.');
    }
    res.render('add');
});

app.post('/add', async (req, res) => {
    if (!await checkDatabaseConnection()) {
        return res.status(500).send('Internal Server Error: Unable to connect to the database.');
    }

    const { name, ingredients, stock, soldDishes, price } = req.body;
    const newItem = {
        name,
        ingredients: ingredients.split(',').map(ingredient => ingredient.trim()),
        stock: parseInt(stock),
        soldDishes: parseInt(soldDishes),
        price: parseFloat(price) // Ensure price is stored as a float
    };
    try {
        await db.collection(collectionName).insertOne(newItem);
        res.redirect('/project5');
    } catch (error) {
        console.error('Error adding dish:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/edit/:id', async (req, res) => {
    if (!await checkDatabaseConnection()) {
        return res.status(500).send('Internal Server Error: Unable to connect to the database.');
    }

    const id = req.params.id;
    try {
        const dish = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
        res.render('edit', { item: dish });
    } catch (error) {
        console.error('Error fetching dish:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/edit/:id', async (req, res) => {
    if (!await checkDatabaseConnection()) {
        return res.status(500).send('Internal Server Error: Unable to connect to the database.');
    }

    const id = req.params.id;
    const { name, ingredients, stock, soldDishes, price } = req.body;
    const updatedItem = {
        name,
        ingredients: ingredients.split(',').map(ingredient => ingredient.trim()),
        stock: parseInt(stock),
        soldDishes: parseInt(soldDishes),
        price: parseFloat(price) // Ensure price is updated as a float
    };
    try {
        await db.collection(collectionName).updateOne({ _id: new ObjectId(id) }, { $set: updatedItem });
        res.redirect('/project5');
    } catch (error) {
        console.error('Error updating dish:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/delete/:id', async (req, res) => {
    if (!await checkDatabaseConnection()) {
        return res.status(500).send('Internal Server Error: Unable to connect to the database.');
    }

    const id = req.params.id;
    try {
        await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
        res.redirect('/project5');
    } catch (error) {
        console.error('Error deleting dish:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/search', async (req, res) => {
    if (!await checkDatabaseConnection()) {
        return res.status(500).send('Internal Server Error: Unable to connect to the database.');
    }

    const query = req.query.query;

    try {
        // Fetch all dishes to calculate total profit
        const allDishes = await db.collection(collectionName).find().toArray();
        const grossProfitAllDishes = allDishes.reduce((acc, item) => {
            const profitPerDish = item.price ? item.price * item.soldDishes : 0;
            return acc + profitPerDish;
        }, 0);

        // Fetch filtered dishes based on the search query
        const dishes = await db.collection(collectionName).find({ name: { $regex: query, $options: 'i' } }).toArray();
        
        // Render the view with filtered dishes and the total profit of all dishes
        res.render('project5', { foodItems: dishes, grossProfit: grossProfitAllDishes });
    } catch (error) {
        console.error('Error searching dishes:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Additional Routes for Portfolio Website
app.get('/', (req, res) => {
    res.render('index'); // Render the about.ejs template
});


app.get('/about', (req, res) => {
    res.render('about'); // Render the about.ejs template
});

app.get('/projects', (req, res) => {
    const projects = [
        { link: 'project1', image: 'https://via.placeholder.com/200x250' },
        { link: 'project2', image: 'https://via.placeholder.com/200x250' },
        { link: 'project3', image: 'https://via.placeholder.com/200x250' }
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

app.listen(port, async () => {
    await connectToDatabase();
    if (await checkDatabaseConnection()) {
        console.log(`Server is running at http://localhost:${port}`);
    } else {
        console.warn('Warning: Unable to connect to the MongoDB database. Please ensure MongoDB is running.');
    }
});
