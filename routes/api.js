const router = require('express').Router();
const { catchErrors } = require('../handlers/errorHandlers');
const UserController = require('../controllers/UserController');
const LobbyController = require('../controllers/LobbyController');
const Auth = require('../middlewares/Auth');
// user apis
router.post('/api/user/login', catchErrors(UserController.login));
router.post('/api/user/register', catchErrors(UserController.register));
router.get('/api/lobby', Auth, catchErrors(LobbyController.getAllLobies));
router.post('/api/lobby/create', Auth, catchErrors(LobbyController.createLobby));

module.exports = router;