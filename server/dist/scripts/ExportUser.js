"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = __importDefault(require("../models/userModel"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
async function exportUsers() {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connecté');
        const users = await userModel_1.default.find().lean();
        fs_1.default.writeFileSync('users-export.json', JSON.stringify(users, null, 2));
        console.log(`✅ Exporté ${users.length} utilisateurs vers users-export.json`);
        process.exit(0);
    }
    catch (err) {
        console.error('❌ Erreur export:', err);
        process.exit(1);
    }
}
exportUsers();
