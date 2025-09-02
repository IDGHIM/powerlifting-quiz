"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const profileController_1 = require("../controllers/profileController");
const router = express_1.default.Router();
// Middleware d'authentification
const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).json({ error: 'Non authentifié' });
    try {
        const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ error: 'Token invalide' });
    }
};
router.use(authenticate);
router.get('/:username', profileController_1.getProfile);
router.post('/', profileController_1.createProfile);
router.put('/:id', profileController_1.updateProfile);
exports.default = router;
