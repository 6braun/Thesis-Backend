// Erstes minimales Backend

fs = require('fs');
path = require('path');

const bodyparser = require("body-parser");
const cors = require("cors");
const express = require("express");

const app = express();

var corsOptions = {
    "origin": "http://localhost:4200"
}
app.use(cors(corsOptions))
app.use(bodyparser.json());
app.use(express.static('images'))

app.get('/beluga', (req, res) => {
    // res.json({'message': 'Yo moin'});
    const filePath = path.join(__dirname, './images/beluga.jpg')
    res.sendFile(filePath);
    //res.end();
})
// let filePath;
// if (req.url === '/beluga') {
//     filePath = path.join(__dirname, './images/beluga.jpg')
// } else {
//     filePath = path.join(__dirname, './images/baum.jpeg')
//
// }
// const stat = fs.readFileSync(filePath)
// res.write(stat);
// res.end();

app.listen(3000, () => console.log('Listening'))
