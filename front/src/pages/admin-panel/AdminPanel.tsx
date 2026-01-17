import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import FeedBackPanel from './FeedBackPanel';
import EnseignantPanel from './EnseignantPanel';
import { useAuth } from '../../context/AuthContext';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'feedback' | 'enseignant'>('feedback');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-6 py-4 font-semibold transition ${
                  activeTab === 'feedback'
                    ? 'border-b-4 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Feedback Management
              </button>
              <button
                onClick={() => setActiveTab('enseignant')}
                className={`px-6 py-4 font-semibold transition ${
                  activeTab === 'enseignant'
                    ? 'border-b-4 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Teacher Management
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="py-8">
        {activeTab === 'feedback' && <FeedBackPanel />}
        {activeTab === 'enseignant' && <EnseignantPanel />}
      </div>
    </div>
  );
}