const userModel = require('../model/userModel');
const etudiantModel = require('../model/etudiantModel');
const enseignantModel = require('../model/enseignantModel');
const enseignantAttenteModel = require('../model/enseignantAttenteModel');
const adminModel = require('../model/adminModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res) => {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
        return res.status(400).json({ 'message': 'Email and password are required.' });
    }

    try {
        const foundUser = await userModel.findByEmail(email);
        if (!foundUser) {
            return res.status(401).json({ 'error': 'Invalid credentials.' });
        }

        // 🔥 Bloquer la connexion si enseignant en attente
        const enseignantEnAttente = await enseignantAttenteModel.findById(foundUser.idUser);
        if (enseignantEnAttente) {
            return res.status(403).json({
                error: "Votre inscription est en attente de validation par l'administrateur."
            });
        }

        const match = await bcryptjs.compare(motDePasse, foundUser.motDePasse);
        if (!match) {
            return res.status(401).json({ 'error': 'Invalid credentials.' });
        }

        let userDetails = { ...foundUser };
        let role = 'user';

        // Check for admin first (highest priority)
        const admin = await adminModel.findById(foundUser.idUser);
        if (admin) {
            userDetails = admin;
            role = 'admin';
        } else {
            // Check for etudiant
            const etudiant = await etudiantModel.findById(foundUser.idUser);
            if (etudiant) {
                userDetails = etudiant;
                role = 'etudiant';
            } else {
                // Check for enseignant
                const enseignant = await enseignantModel.findById(foundUser.idUser);
                if (enseignant) {
                    // 🔥 Block login if teacher is suspended
                    if (enseignant.suspended) {
                        return res.status(403).json({
                            error: "Your account has been suspended. Please contact the administrator."
                        });
                    }
                    userDetails = enseignant;
                    role = 'enseignant';
                }
            }
        }

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "userId": foundUser.idUser,
                    "email": foundUser.Email,
                    "role": role
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        const refreshToken = jwt.sign(
            {
                "userId": foundUser.idUser,
                "email": foundUser.Email
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        delete userDetails.motDePasse;

        res.json({
            success: true,
            accessToken,
            user: {
                ...userDetails,
                role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 'error': err.message });
    }
}

module.exports = { handleLogin };