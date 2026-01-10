import { useState, useEffect } from 'react';

interface User {
  idUser: number;
  nom: string;
  prenom: string;
  email: string;
}

interface Enseignant {
  idUser: number;
  Specialite: string | null;
  Grade: string | null;
  user?: User;
}

export default function EnseignantPanel() {
  const [approvedEnseignants, setApprovedEnseignants] = useState<Enseignant[]>([]);
  const [pendingEnseignants, setPendingEnseignants] = useState<Enseignant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Récupérer tous les enseignants
  const fetchEnseignants = async () => {
    try {
      const [approvedRes, pendingRes] = await Promise.all([
        fetch('http://localhost:5000/enseignant/approved'),
        fetch('http://localhost:5000/enseignant/pending'),
      ]);

      if (approvedRes.ok) {
        const approvedData = await approvedRes.json();
        setApprovedEnseignants(approvedData);
      }

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingEnseignants(pendingData);
      }
    } catch (err) {
      setError('Failed to fetch enseignants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnseignants();
  }, []);

  // Approve enseignant
  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/enseignant/approve/${id}`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchEnseignants();
      } else {
        setError('Failed to approve enseignant');
      }
    } catch (err) {
      setError('Failed to approve enseignant');
      console.error(err);
    }
  };

  // Delete enseignant
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/enseignant/pending/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEnseignants();
      } else {
        setError('Failed to delete enseignant');
      }
    } catch (err) {
      setError('Failed to delete enseignant');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading enseignants...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Enseignant Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Pending Enseignants */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-orange-600">
          Pending Enseignants ({pendingEnseignants.length})
        </h2>
        {pendingEnseignants.length === 0 ? (
          <p className="text-gray-500">No pending enseignants</p>
        ) : (
          <div className="grid gap-4">
            {pendingEnseignants.map((enseignant) => (
              <div
                key={enseignant.idUser}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {enseignant.user?.nom} {enseignant.user?.prenom}
                    </h3>
                    <p className="text-sm text-gray-600">{enseignant.user?.email}</p>
                  </div>
                </div>
                <div className="mb-3">
                  {enseignant.Specialite && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Spécialité:</span> {enseignant.Specialite}
                    </p>
                  )}
                  {enseignant.Grade && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Grade:</span> {enseignant.Grade}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleApprove(enseignant.idUser)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDelete(enseignant.idUser)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Enseignants */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          Approved Enseignants ({approvedEnseignants.length})
        </h2>
        {approvedEnseignants.length === 0 ? (
          <p className="text-gray-500">No approved enseignants</p>
        ) : (
          <div className="grid gap-4">
            {approvedEnseignants.map((enseignant) => (
              <div
                key={enseignant.idUser}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {enseignant.user?.nom} {enseignant.user?.prenom}
                    </h3>
                    <p className="text-sm text-gray-600">{enseignant.user?.email}</p>
                  </div>
                </div>
                <div>
                  {enseignant.Specialite && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Spécialité:</span> {enseignant.Specialite}
                    </p>
                  )}
                  {enseignant.Grade && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Grade:</span> {enseignant.Grade}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}