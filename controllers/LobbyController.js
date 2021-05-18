require("dotenv").config();
const Lobby = require('../models/Lobby');
exports.createLobby = async (req, res) => {
    const { name } = req.body;
    const nameRegex = /^[A-Za-z0-9\s]+$/;
    if (!nameRegex.test(name)) {
        return res.json({
            message: "Lobby name can contain only alphabets and numbers"
        });
    }
    const lobby = new Lobby({
        name,
    });
    await lobby.save();
    res.status(200).json({
        message: 'lobby created successfully!',
    });
}
exports.getAllLobies = async (req, res) => {
    const lobby = await Lobby.find({});
    res.status(200).json({
        lobby
    });
}