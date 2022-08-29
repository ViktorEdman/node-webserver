const express = require('express')
const Article = require('../models/article')
const router = express.Router()

//Create new article
router.get('/new', (req, res) => {
    res.render('articles/new')
})

//Articles list at /articles
router.get("/", async (req, res) => {
    const articles = await Article.findAll({raw:true, order:[['createdAt', 'DESC']]});
    res.render('articles/index', {articles})
    console.log(articles)
})

//Get specific article
router.get('/:id', async (req, res) => {
    const dbArticle = await Article.findByPk(req.params.id);
    if (dbArticle === null) res.redirect('/articles')
    const article = extractArticleFromDbResponse(dbArticle)
    res.render('articles/show', {article})
})

//Create new article
router.post('/', async (req,res) => {
    let article = Article.build({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    })
    try {
        article = await article.save();
        console.log(`Article with id ${article.id} was saved to db`)
        res.redirect(`articles/${article.id}`)
    } catch (error) {
        console.log(error)
        res.render('articles/new', {article})
    }
    
}) 

function extractArticleFromDbResponse(dbArticle) {
    return {        
        id: dbArticle.getDataValue('id'),
        title: dbArticle.getDataValue('title'),
        description: dbArticle.getDataValue('description'),
        submittedAt: dbArticle.getDataValue('createdAt'),
        markdown: dbArticle.getDataValue('markdown')
    }
}


module.exports = router