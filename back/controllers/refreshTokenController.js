const userModel = require('../model/userModel');
const etudiantModel = require('../model/etudiantModel');
const enseignantModel = require('../model/enseignantModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    try {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403);

                const foundUser = await userModel.findById(decoded.userId);
                if (!foundUser) return res.sendStatus(403);

                let role = 'user';
                const etudiant = await etudiantModel.findById(foundUser.idUser);
                if (etudiant) {
                    role = 'etudiant';
                } else {
                    const enseignant = await enseignantModel.findById(foundUser.idUser);
                    if (enseignant) {
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

                res.json({ accessToken });
            }
        );
    } catch (error) {
        console.error('Refresh token error:', error);
        res.sendStatus(403);
    }
}

module.exports = { handleRefreshToken }