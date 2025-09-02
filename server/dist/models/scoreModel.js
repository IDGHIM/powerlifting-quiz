"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Score = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const scoreSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    points: { type: Number, required: true },
    category: { type: String, required: true },
    mode: { type: String, required: true },
}, {
    timestamps: true,
});
exports.Score = mongoose_1.default.model('Score', scoreSchema);
exports.default = exports.Score;
