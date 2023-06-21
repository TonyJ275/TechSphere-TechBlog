const mongoose = require('mongoose');
const Category = require('../models/Category');

let allowedCategories = [];

async function fetchCategories() {
    try {
        const categories = await Category.find({});
        categories.forEach(category => {
            allowedCategories.push(category.name);
        });
        // console.log(allowedCategories);
    }
    catch (error) {
        console.log(error);
    }
}

fetchCategories();

const articleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
    },
    image: {
        type: String,
        required: 'This field is required.'
    },
    description: {
        type: String,
        required: 'This field is required.'
    },
    category: {
        type: String,
        enum: allowedCategories,
        required: 'This field is required.'
    },
    email: {
        type: String,
        required: 'This field is required.'
    },
}, {
    timestamps: true
})

articleSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Article', articleSchema);