const mongoose = require('mongoose');
const PlayerMovesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'User id is required',
    },
    diceVal: {
        type: Number,
        required: 'Dice value is required',
    },
});
module.exports = PlayerMoves = mongoose.model('playerMoves', PlayerMovesSchema);