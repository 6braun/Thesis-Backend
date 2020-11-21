// Erstes minimales Backend
path = require('path');

const bodyparser = require("body-parser");
const cors = require("cors");

// Express ist ein Framework zur Bereitstellung einer REST-API
const express = require("express");

// Ist eine Middleware zur Behandlung von multipart/form-data,
// also dem Upload aus dem Frontend
const multer = require("multer");
// API für die Ethereum-Blockchain
const web3 = require("web3")

const app = express();


app.use(cors())
app.use(bodyparser.json());


const storage = multer.diskStorage({

    // Setzen des Verzeichnis für die Uploads
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },

    // Namen der hochgeladenen Datei setzen
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
})

var upload = multer({
    storage: storage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.jpg$/)) {
            //Error
            cb(new Error('Nur jpgs dürfen hochgeladen werden'));
        }
        //Success
        cb(undefined, true);
    }
})
// GETTER-METHODE FÜR DAS BELUGA-BILD
app.get('/beluga', (req, res) => {
    const filePath = path.join(__dirname, './images/beluga.jpg');
    res.sendFile(filePath);
    //res.end();
});

// GETTER-METHODE FÜR DAS FUCHS-BILD
app.get('/foxes', (req, res) => {
    const filePath = path.join(__dirname, './images/foxes.jpg');
    res.sendFile(filePath);
    //res.end();
});
// POST-REQUEST, MIT DER DATEIEN HOCHGELADEN WERDEN KÖNNEN (SIEHE /uploads)
app.post('/upload', upload.single('uploadedImage'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Datei ungültig')
        error.httpStatusCode = 400
        return next(error)
    }
    res.status(200).send({
        statusCode: 200,
        status: 'success',
        uploadedFile: file
    })
}, (error, req, res) => {
    res.status(400).send({
        error: error.message
    })
})

app.listen(3000, () => console.log('Listening'))
