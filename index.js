require('dotenv').config()
const express = require('express');
const createError = require('http-errors')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require("helmet")
const xss = require('helmet')
const app = express();
const port = process.env.PORT;
const mainRouter = require('./src/routes/IndexRouter')
const upload = require('./src/middleware/MulterMiddleware')
const cloudinary = require('./cloudinary')
const fs = require('fs')

// body parse express 
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(cors());
app.use(morgan('dev'));


// router utama
// app.post('/product/', (req, res) => {
//     console.log(req);
// })
app.use('/', mainRouter);

app.use(helmet());
app.use(xss());
app.use('/img', express.static('src/upload'))
// app.use('/img', upload.array('image'), async (req, res) => {
//     const uploader = async (path) => await cloudinary.upload(path, 'images')

//     if (req.method === "POST") {
//         const urls = []
//         const files = req.files

//         for (const file of files) {
//             const { path } = file
//             const newPath = await uploader(path)
//             urls.push(newPath)
//             fs.unlinkSync(path)

//         }

//         res.status(200).json({
//             message: 'Images Upload Successfull',
//             data: urls
//         })
//     } else {
//         res.status(405).json({
//             err: "Images not upoaded successfuly"
//         })
//     }
// })
app.all('*', (req, res, next) => {
    next(new createError.NotFound())
})

app.use((err, req, res, next) => {
    const messageError = err.message || "internal server error"
    const statusCode = err.status || 500

    res.status(statusCode).json({
        message: messageError
    })

    next()
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})