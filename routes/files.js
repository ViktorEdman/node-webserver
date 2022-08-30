const express = require('express')
const router = express.Router()
const basicAuth = require('express-basic-auth')

const fs = require('fs/promises')

const listDirFiles = async (dir) => {
    const fileList = await fs.readdir(dir)
    return fileList.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item)) //remove hidden files
}

router.use((basicAuth({
    users: { 'mongo': 'derpderp' },
    challenge: true
})))


//Display index page
router.get("/", async (req, res) => {
    const files = await listDirFiles("uploaded_files")
    res.render('files/index', {files})
})



//Create new file
router.post('/', async (req,res) => {
    console.log(req.files)
    res.redirect('/files')
}) 

//Retrieve a file
router.get("/:filename", async (req, res) => {
    res.download(process.cwd()+"/uploaded_files/"+req.params.filename)
})

//list all files

module.exports = router