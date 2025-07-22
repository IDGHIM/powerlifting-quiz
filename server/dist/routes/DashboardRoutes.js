"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.get('/dashboard', authMiddleware_1.default, (req, res) => {
    const { username, role } = req.user; // Le ! indique à TS que req.user est défini après le middleware
    res.json({ message: `Bienvenue ${username}, votre rôle est ${role}` });
});
exports.default = router;
