const userModel = require('../model/userModel');
const etudiantModel = require('../model/etudiantModel');
const enseignantModel = require('../model/enseignantModel');
const enseignantAttenteModel = require('../model/enseignantAttenteModel');
const bcryptjs = require('bcryptjs');

const handleNewUser = async (req, res) => {
    const { nom, prenom, dateNaissance, email, motDePasse, userType, specialite, annee, grade } = req.body;

    if (!nom || !prenom || !email || !motDePasse) {
        return res.status(400).json({ 'message': 'All required fields must be provided.' });
    }

    if (userType === 'etudiant' && (!specialite || !annee)) {
        return res.status(400).json({ 'message': 'Specialite and Annee are required for students.' });
    }

    if (userType === 'enseignant' && (!specialite || !grade)) {
        return res.status(400).json({ 'message': 'Specialite and Grade are required for teachers.' });
    }

    try {
        const duplicate = await userModel.findByEmail(email);
        if (duplicate) {
            return res.status(409).json({ 'error': 'Email already exists.' });
        }

        const hashedPwd = await bcryptjs.hash(motDePasse, 10);
        const nextId = await userModel.getNextId();

        const newUser = await userModel.create({
            idUser: nextId,
            nom,
            prenom,
            dateNaissance,
            email,
            motDePasse: hashedPwd
        });

        if (userType === 'etudiant') {
            await etudiantModel.create({
                idUser: nextId,
                specialite,
                annee: parseInt(annee)
            });
        } else if (userType === 'enseignant') {
            console.log("Enseignant détecté, insertion dans ENSEIGNANT_ATTENTE...");
            const enseignantAttente = await enseignantAttenteModel.create({
                idUser: nextId,
                specialite,
                grade
            });
            console.log("Résultat insertion enseignant attente:", enseignantAttente);
        } else {
            res.status(201).json({
                success: true,
                message: `Nouvel utilisateur ${prenom} ${nom} créé!`
            });
        }

        res.status(201).json({
            'success': true,
            'message': `New user ${prenom} ${nom} created!`
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ 'error': err.message });
    }
}

module.exports = { handleNewUser };