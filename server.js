const models = require('./models');
const http = require('http');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const app = express();

const db = ('../models')
const zang = require('./routes/zang');

const WebSocket = require('ws');

const port = process.env.PORT || '8082';

const server = http.createServer(app);

const wss = new WebSocket.Server({server});
const socketEventEmitter = require('./controller/socketEmitters')

wss.on('connection', function connection(ws, req) {
  ws.send(`${req.connection.remoteAddress} connected to ${server.address().address}:${port} `);
  console.log(`Connected to ${req.connection.remoteAddress}`);

});
//setup the broadcast function
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};
// broadcast when embedded event in triggered
socketEventEmitter.on('routeTrigger', (x) => {
  wss.broadcast(JSON.stringify(x))
});

function globalDataUpdate () {
  models.Table.findAll({}).then((dbEntries) => {
		console.log(wss)
		wss.broadcast = function broadcast(data) {
			wss.clients.forEach(function each(client) {
				if (client.readyState === WebSocket.OPEN) {
					client.send(data);
				}
			});
		};
		wss.broadcast(JSON.stringify(dbEntries))
		
		
	
	});
}

models.sequelize.sync({force: false}).then(function() {


app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(express.static('./public'));
// app.use('/zang', function (req, res, next) {
//   globalDataUpdate();
//   next();
// });
app.use('/zang', zang);

server.listen(port, () => {
  console.log(`Express server listening on port ${server.address().port}`);
})


});



