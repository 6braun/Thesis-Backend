// Erstes minimales Backend
const path = require('path');
const fs = require('fs');
const _ = require('lodash');


const blockchain = require('./blockchain');

// const index = blockchain.getIndex();

const bodyparser = require("body-parser");
const cors = require("cors");

// Express ist ein Framework zur Bereitstellung einer REST-API
const express = require("express");

// Ist eine Middleware zur Behandlung von multipart/form-data,
// also dem Upload aus dem Frontend
const multer = require("multer");


const app = express();


app.use(cors())
app.use(bodyparser.json());


var upload = multer({
    dest: "./uploads"
})
// GETTER-METHODE FÜR DAS BELUGA-BILD
app.get('/getImage', (req, res) => {
    const fileToHost = getRandomFile();
    if(fileToHost){
    const filePath = path.join(__dirname, './uploads/' + fileToHost);
    res.sendFile(filePath);

    const index = getIndexOfFile(fileToHost)
    blockchain.showAd(index).then(res => {
        console.log('Ad Shown');
    }).catch(err => {
        console.log('no Funds left');
    })}
    else{
        res.sendStatus(400);
    }
});

function getRandomFile() {
    const files = fs.readdirSync('./uploads/');
    return _.sampleSize(files, 1)[0];
}


// POST-REQUEST, MIT DER DATEIEN HOCHGELADEN WERDEN KÖNNEN (SIEHE /uploads)
app.post('/upload', upload.single('uploadedImage'), (req, res) => {
    const tempPath = req.file.path;
    const index = getIndex();
    const originalFilename = req.file.originalname.substring(0, req.file.originalname.indexOf('.'));
    const filename = originalFilename + index + '.jpg';
    const targetPath = path.join(__dirname, "./uploads/" + filename);

    if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
        fs.rename(tempPath, targetPath, err => {
            if (err) return handleError(err, res);

            res
                .status(200)
                .contentType("text/plain")
                .end("Your Id is:" + getIndexAsNumber(index).toString());
        });

        const newAd = {
            id: getIndexAsNumber(index),
            // Funds werden von Ether in Gwei umgewandelt
            funds: parseFloat(req.body['etherSend']) * (10 ** 9)
        };
        blockchain.newAd(newAd).then(res => console.log(res)).catch(err => console.log(err));

    } else {
        fs.unlink(tempPath, err => {
            if (err) return handleError(err, res);

            res
                .status(403)
                .contentType("text/plain")
                .end("Only .jpeg files are allowed!");
        });
    }
})

app.listen(3000, () => console.log('Listening'));



// Helferfunktionen für das Behandeln von Indezes in diesem Anwendungsfall

function getIndex() {
    var files = fs.readdirSync('./uploads/');

    if (files.length === 1) {
        return '_1';
    } else {
        return getCurrentFileIndexForName(files);
    }
}


function getCurrentFileIndexForName(_files) {

    let index;
    let files = _files.filter(el => {
        return el.toString().includes('_');
    })
    files = files.map(el => {
        return parseInt(el.substring(el.lastIndexOf('_') + 1, el.length))
            ;
    });
    index = files.reduce((a, b) => Math.max(a, b));

    index += 1
    return '_' + index;
}

function getIndexOfFile(file) {
    const index = file.substring(file.lastIndexOf('_') + 1, file.indexOf('.'));
    return parseInt(index);
}

function getIndexAsNumber(_index) {
    let index = _index.substring(_index.indexOf('_') + 1, _index.length);
    return parseInt(index);
}



