import { useState } from 'react';
import FeedBackPanel from './FeedBackPanel';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'feedback' | 'other'>('feedback');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
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
              onClick={() => setActiveTab('other')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'other'
                  ? 'border-b-4 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Teacher Management
            </button>
          </div>
        </div>
      </div>

      <div className="py-8">
        {activeTab === 'feedback' && <FeedBackPanel />}
        {activeTab === 'other' && (
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">Teacher Management</h2>
            <p className="text-gray-600">Content for other admin section coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
