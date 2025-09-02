"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.createProfile = exports.getProfile = void 0;
const profileModel_1 = __importDefault(require("../models/profileModel"));
const getProfile = async (req, res) => {
    try {
        const { username } = req.params;
        let profile = await profileModel_1.default.findOne({ username });
        if (!profile) {
            return res.status(404).json({ message: 'Profil non trouvé' });
        }
        res.json(profile);
    }
    catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
exports.getProfile = getProfile;
const createProfile = async (req, res) => {
    try {
        const { username, name, weightClass, squat, bench, deadlift, profileImage } = req.body;
        const existingProfile = await profileModel_1.default.findOne({ username });
        if (existingProfile) {
            return res.status(400).json({ message: 'Un profil existe déjà pour cet utilisateur' });
        }
        const profile = new profileModel_1.default({
            username, name, weightClass, squat, bench, deadlift, profileImage
        });
        const savedProfile = await profile.save();
        res.status(201).json(savedProfile);
    }
    catch (error) {
        console.error('Erreur lors de la création du profil:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
exports.createProfile = createProfile;
const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, weightClass, squat, bench, deadlift, profileImage } = req.body;
        const profile = await profileModel_1.default.findByIdAndUpdate(id, { name, weightClass, squat, bench, deadlift, profileImage }, { new: true, runValidators: true });
        if (!profile) {
            return res.status(404).json({ message: 'Profil non trouvé' });
        }
        res.json(profile);
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
exports.updateProfile = updateProfile;
