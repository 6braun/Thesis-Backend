// Erstes minimales Backend

http = require('http');
fs = require('fs')
path = require('path')

server = http.createServer((req, res) => {
    let filePath;
    if (req.url === '/beluga') {
        filePath = path.join(__dirname, './images/beluga.jpg')
    } else {
        filePath = path.join(__dirname, './images/baum.jpeg')

    }
    const stat = fs.readFileSync(filePath)
    res.write(stat);
    res.end();
})

server.listen(3000);


