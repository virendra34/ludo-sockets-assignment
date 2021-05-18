// bring in env file
require("dotenv").config();
const User = require('./models/User');
const Lobby = require('./models/Lobby');
// bringin jsonwebtoken
const jwt = require('jsonwebtoken');
// setup express
const app = require('./configs/app');
// bring in db
const connectDB = require('./configs/db');
// set port
const port = process.env.PORT || 8000;
// connect DB
connectDB();
// start server
const server = app.listen(port, () => {
    console.log(`Server is listining on port:${port}`)
});
// setup socket
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});
const exists = (arr, search, col) => {
    return arr.some(row => row[col] === search);
}
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.query.token;
        const payload = jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                const err = new Error("Forbidden");
                err.data = { content: "Please retry later" }; // additional details
                next(err);
            }
            // console.log('socket:',socket);
            return decode;
        });
        socket.userId = payload.user.id;
        next();
    } catch (err) { }
});
let lobby = null;
const usersList = [];
io.on('connection', async (socket) => {
    const user = await User.findOne({ _id: socket.userId });
    console.log(`Connected ${socket.userId}`);
    // disconnect event
    socket.on('disconnect', () => {
        console.log(`Disconnected: ${socket.userId}`)
    });
    // join room event
    socket.on('joinLobby', async ({ lobbyId }) => {
        socket.join(lobbyId);
        console.log(`A user joined lobby: ${lobbyId}`);
        const user = await User.findOne({ _id: socket.userId });
        // console.log(exists(usersList, user.id, 'id'), usersList);
        if (!exists(usersList, user.id, 'id')) {
            usersList.push(user);
        }
        // send room users details
        const lobby = await Lobby.findOne({ _id: lobbyId });
        io.to(lobbyId).emit('lobbyUsers', {
            lobby: lobby.name,
            users: usersList,
        });
    })
    // leave room event
    socket.on('leaveLobby', ({ lobbyId }) => {
        socket.leave(lobbyId);
        console.log(`A user left lobby: ${lobbyId}`);
    })

    socket.on('rollDice', async ({ lobbyId }) => {
        const user = await User.findOne({ _id: socket.userId });
        socket.join(lobbyId);
        console.log('roll dice event triggered', lobbyId);
        const diceVal = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
        const msg = `${user.name} got ${diceVal} on dice`;
        io.to(lobbyId).emit('diceVal', { diceVal, msg });
    });
});