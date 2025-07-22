"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const quizRoutes_1 = __importDefault(require("./routes/quizRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';
// Middlewares globaux avant les routes
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://192.168.10.5:3000'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express_1.default.json());
// Logging simple
app.use((req, res, next) => {
    console.log(`👉 ${req.method} ${req.url}`);
    next();
});
// Route de test simple
app.get('/', (req, res) => {
    res.send('API est fonctionnelle !');
});
// Routes API
app.use('/api', authRoutes_1.default);
app.use('/api', quizRoutes_1.default);
// Connexion à MongoDB puis lancement serveur
mongoose_1.default.connect(mongoUri)
    .then(() => {
    console.log('✅ MongoDB connecté');
    app.listen(port, () => console.log(`🚀 Serveur sur http://localhost:${port}`));
})
    .catch(err => console.error('❌ Erreur connexion MongoDB', err));
