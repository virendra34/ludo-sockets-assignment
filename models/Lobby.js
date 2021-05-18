const mongoose = require('mongoose');
const LobbySchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name is required',
    }
});
module.exports = Lobby = mongoose.model('lobby', LobbySchema);