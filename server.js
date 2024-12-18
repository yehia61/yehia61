const express = require('express');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

let app = express();

// الاتصال بقاعدة البيانات
mongoose.connect('mongodb://127.0.0.1:27017/', { dbName: 'test' }) // تأكد من تحديد اسم قاعدة البيانات
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection error:', err));

app.listen(3000, function () {
  console.log('Server is running on port 3000');
});


const homeSchema = new mongoose.Schema({
    categories: String,
    sign_in: String,
    sign_up: String,
});
const Home = mongoose.model('Home', homeSchema);

const categoriesSchema = new mongoose.Schema({
    section_name: String,
});
const Categories = mongoose.model('categories', categoriesSchema);

const sign_inSchema = new mongoose.Schema({
    email_address: String,
    password: String,
});
const SignIn = mongoose.model('sign_in', sign_inSchema);

const sign_upSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email_address: String,
    password: String,
});
const SignUp = mongoose.model('sign_up', sign_upSchema);

// Insert categories if they don't exist
async function createCategories() {
    const categories = ['action', 'science_fiction', 'animation', 'drama', 'mystery', 'horror'];
    for (let category of categories) {
        const exists = await Categories.findOne({ section_name: category });
        if (!exists) {
            await new Categories({ section_name: category }).save();
        }
    }
}
createCategories();

// Routes

// Get all categories
app.get('/categories', asyncHandler(async (req, res) => {
    const categories = await Categories.find();
    res.status(200).json(categories);
}));

// Get all categories (using body-parser route)
app.get('/body-parser', asyncHandler(async (req, res) => {
    const categories = await Categories.find();
    res.status(200).json(categories); // Fixed by returning categories instead of section_name
}));

// Default route
app.get('/', (req, res) => {
    res.send("Welcome");
});

// Start server
app.listen(8080, () => {
    console.log('Server is now open');
});