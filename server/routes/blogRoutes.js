const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

/*
    App Routes
*/

router.get('/', articleController.homepage);
router.get('/categories', articleController.exploreCategories);
router.get('/categories/:id', articleController.exploreCategoryArticlesById);
router.get('/articles/:id', articleController.exploreArticles);
router.post('/search', articleController.searchArticle);
router.get('/explore-latest', articleController.exploreLatest);
router.get('/add-article', articleController.addArticle);
router.post('/add-article', articleController.submitArticle);
router.get('/about', articleController.aboutUs);
router.get('/contact', articleController.contact);


module.exports = router;