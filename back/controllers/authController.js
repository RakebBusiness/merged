const userModel = require('../model/userModel');
const etudiantModel = require('../model/etudiantModel');
const enseignantModel = require('../model/enseignantModel');
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

        const match = await bcryptjs.compare(motDePasse, foundUser.motDePasse);
        if (!match) {
            return res.status(401).json({ 'error': 'Invalid credentials.' });
        }

        let userDetails = { ...foundUser };
        let role = 'user';

        const etudiant = await etudiantModel.findById(foundUser.idUser);
        if (etudiant) {
            userDetails = etudiant;
            role = 'etudiant';
        } else {
            const enseignant = await enseignantModel.findById(foundUser.idUser);
            if (enseignant) {
                userDetails = enseignant;
                role = 'enseignant';
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