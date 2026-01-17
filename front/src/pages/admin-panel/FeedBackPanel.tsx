import { useState, useEffect } from 'react';

interface Feedback {
  idFeedback: number; // correspond à ta colonne
  name: string;
  email: string | null;
  message: string;
  rating: number | null;
  created_at: string;
}

export default function FeedBackPanel() {
  const [approvedFeedback, setApprovedFeedback] = useState<Feedback[]>([]);
  const [pendingFeedback, setPendingFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Récupérer tous les feedbacks
  const fetchFeedback = async () => {
    try {
      const [approvedRes, pendingRes] = await Promise.all([
        fetch('http://localhost:5000/feedback/approved'),
        fetch('http://localhost:5000/feedback/pending'), // plus besoin d'auth
      ]);

      if (approvedRes.ok) {
        const approvedData = await approvedRes.json();
        setApprovedFeedback(approvedData);
      }

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingFeedback(pendingData);
      }
    } catch (err) {
      setError('Failed to fetch feedback');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Approve feedback
  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/feedback/approve/${id}`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchFeedback();
      } else {
        setError('Failed to approve feedback');
      }
    } catch (err) {
      setError('Failed to approve feedback');
      console.error(err);
    }
  };

  // Delete pending feedback
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/feedback/pending/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchFeedback();
      } else {
        setError('Failed to delete feedback');
      }
    } catch (err) {
      setError('Failed to delete feedback');
      console.error(err);
    }
  };

  // Delete approved feedback
  const handleDeleteApproved = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this approved feedback?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/feedback/approved/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchFeedback();
      } else {
        setError('Failed to delete approved feedback');
      }
    } catch (err) {
      setError('Failed to delete approved feedback');
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading feedback...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Feedback Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Pending Feedback */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-orange-600">
          Pending Feedback ({pendingFeedback.length})
        </h2>
        {pendingFeedback.length === 0 ? (
          <p className="text-gray-500">No pending feedback</p>
        ) : (
          <div className="grid gap-4">
            {pendingFeedback.map((feedback) => (
              <div
                key={feedback.idFeedback}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{feedback.name}</h3>
                    {feedback.email && (
                      <p className="text-sm text-gray-600">{feedback.email}</p>
                    )}
                  </div>
                  {renderStars(feedback.rating)}
                </div>
                <p className="text-gray-700 mb-3">{feedback.message}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {formatDate(feedback.created_at)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(feedback.idFeedback)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(feedback.idFeedback)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Feedback */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          Approved Feedback ({approvedFeedback.length})
        </h2>
        {approvedFeedback.length === 0 ? (
          <p className="text-gray-500">No approved feedback</p>
        ) : (
          <div className="grid gap-4">
            {approvedFeedback.map((feedback) => (
              <div
                key={feedback.idFeedback}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{feedback.name}</h3>
                    {feedback.email && (
                      <p className="text-sm text-gray-600">{feedback.email}</p>
                    )}
                  </div>
                  {renderStars(feedback.rating)}
                </div>
                <p className="text-gray-700 mb-3">{feedback.message}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {formatDate(feedback.created_at)}
                  </span>
                  <button
                    onClick={() => handleDeleteApproved(feedback.idFeedback)}
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
    </div>
  );
}
