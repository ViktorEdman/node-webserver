//Dependencies

const express = require('express')
const Article = require('../models/article')
const router = express.Router()

router.get("/articles", async (req, res) => {
    const articles = await Article.findAll({raw:true, order:[['createdAt', 'DESC']]});
    res.json(articles)
    console.log(articles)
})

router.get('/articles/:id', async (req, res) => {
    const dbArticle = await Article.findByPk(req.params.id);
    if (dbArticle === null) res.json({response: "No article found with this id"})
    const article = extractArticleFromDbResponse(dbArticle)
    res.json({article})
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