import  { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    email: "",
    motDePasse: "",
    confirmPassword: "",
    userType: "etudiant",
    specialite: "",
    annee: "",
    grade: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "motDePasse") calculatePasswordStrength(value);
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = "";
    if (password.length === 0) strength = "";
    else if (password.length < 6) strength = "weak";
    else if (password.length < 8) strength = "medium";
    else strength = "strong";

    setPasswordStrength(strength);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.dateNaissance) {
      const age = calculateAge(formData.dateNaissance);
      if (age < 16) return alert("Vous devez avoir au moins 16 ans");
      if (age > 100) return alert("Veuillez vérifier votre date de naissance");
    }

    if (formData.motDePasse !== formData.confirmPassword)
      return alert("Les mots de passe ne correspondent pas");

    if (formData.motDePasse.length < 6)
      return alert("Le mot de passe doit contenir au moins 6 caractères");

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        if (formData.userType === 'enseignant') {
        alert("Votre inscription est en attente"); // "Votre inscription est en attente..."
        navigate("/login"); // Tu peux toujours rediriger vers login
    } else {
        alert("🎉 Inscription réussie !");
        navigate("/login");
    }
      } else alert(data.error);
    } catch {
      alert("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthText = () =>
    passwordStrength === "weak"
      ? "Faible"
      : passwordStrength === "medium"
      ? "Moyen"
      : passwordStrength === "strong"
      ? "Fort"
      : "";

  const getMaxBirthDate = () => {
    const today = new Date();
    const max = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    return max.toISOString().split("T")[0];
  };

  const getMinBirthDate = () => {
    const today = new Date();
    const min = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    return min.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-lg p-8 relative">
        <h1 className="text-2xl font-bold mb-2 text-center">Inscription</h1>
        <p className="text-gray-500 text-center mb-6">
          Rejoignez notre communauté académique
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              placeholder="Votre nom de famille"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Prénom */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              placeholder="Votre prénom"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Date de naissance */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Date de naissance</label>
            <input
              type="date"
              name="dateNaissance"
              value={formData.dateNaissance}
              onChange={handleChange}
              required
              min={getMaxBirthDate()}
              max={getMinBirthDate()}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <small className="text-gray-400 text-sm">Vous devez avoir au moins 16 ans</small>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre@email.com"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Type de compte */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Type de compte</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="etudiant">Étudiant</option>
              <option value="enseignant">Enseignant</option>
            </select>
          </div>

          {/* Spécialité */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Spécialité</label>
            <input
              type="text"
              name="specialite"
              value={formData.specialite}
              onChange={handleChange}
              required
              placeholder="Ex : Informatique, Mathématiques..."
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Année / Grade */}
          {formData.userType === "etudiant" && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Année d'étude</label>
              <select
                name="annee"
                value={formData.annee}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Sélectionnez</option>
                <option value="1">Licence 1</option>
                <option value="2">Licence 2</option>
                <option value="3">Licence 3</option>
                <option value="4">Master 1</option>
                <option value="5">Master 2</option>
              </select>
            </div>
          )}

          {formData.userType === "enseignant" && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Grade académique</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Sélectionnez</option>
                <option value="Professeur">Professeur</option>
                <option value="Maître de conférences">Maître de Conférences</option>
                <option value="Chargé de cours">Chargé de Cours</option>
                <option value="Assistant">Assistant</option>
                <option value="Vacataire">Vacataire</option>
              </select>
            </div>
          )}

          {/* Mot de passe */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Minimum 6 caractères"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {passwordStrength && (
              <small
                className={`font-semibold text-sm ${
                  passwordStrength === "weak"
                    ? "text-red-500"
                    : passwordStrength === "medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                Force du mot de passe: {getPasswordStrengthText()}
              </small>
            )}
          </div>

          {/* Confirmation */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Confirmation</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Retapez votre mot de passe"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-2 rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? "Création du compte..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          Déjà membre ? <Link to="/login" className="text-indigo-600 font-semibold">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
