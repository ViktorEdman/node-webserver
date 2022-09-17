const express = require('express')
const router = express.Router()
const basicAuth = require('express-basic-auth')

const formidable = require('formidable')

const fs = require('fs/promises')

const listDirFiles = async (dir) => {
    const fileList = await fs.readdir(dir)
    return fileList.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item)) //remove hidden files
}

router.use(
    basicAuth({
        users: { admin: 'admin' },
        challenge: true,
    })
)

//Create new file
router.post('/', async (req, res, next) => {
    const uploadDirectory = process.cwd()+'/uploaded_files'
    const form = formidable({ 
        uploadDir: uploadDirectory
    })

    form.parse(req, async (err, fields, upload) => {
        if (err) {
            next(err)
            return
        }
        
    
        try {
            console.log()
            await fs.rename(upload.file.filepath, form.uploadDir+'/'+upload.file.originalFilename)
        } catch (error) {
            next(error)
        }
        res.redirect('/files')
    })
})

//Display index page
router.get('/', async (req, res) => {
    const files = await listDirFiles('uploaded_files')
    res.render('files/index', { files })
})

//Retrieve a file
router.get('/:filename', async (req, res) => {
    res.download(process.cwd() + '/uploaded_files/' + req.params.filename)
})

//list all files

module.exports = router
