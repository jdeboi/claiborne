const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');
const http = require("http");
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);

// var io = module.exports.io = require('socket.io')(server);
// const ClientManager = require('./websockets/ClientManager');
// io.on('connection', ClientManager);



app.post('/api/post/critique', cors(), async (req, res, next) => {
  try {
    fs.readFile('./data/critiques.json', function (err, data) {
      var json = JSON.parse(data)
      const crit = req.body;
      // crit.time = new Date();
      json.push(crit);
      fs.writeFile('./data/critiques.json', JSON.stringify(json), 'utf-8', function (err) {
        if (err) throw err
        console.log('ADDED CRIT', crit);
        io.emit("critique", crit);
        res.send(crit);
      })
    })
  } catch (err) {
    next(err);
    // console.log(err);
  }
})


// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
})




// Choose the port and start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
