"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const profileSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        ref: 'User'
    },
    name: { type: String, default: '' },
    weightClass: { type: String, default: '' },
    squat: { type: String, default: '' },
    bench: { type: String, default: '' },
    deadlift: { type: String, default: '' },
    profileImage: { type: String, default: '' }
}, {
    timestamps: true
});
const Profile = mongoose_1.default.model('Profile', profileSchema);
exports.default = Profile;
