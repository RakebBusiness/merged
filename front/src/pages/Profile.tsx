import { User, Mail, Calendar } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { exercisesApi } from '../services/api';

export default function Profile() {
  const { user } = useAuth();
  const [totalExercises, setTotalExercises] = useState(0);
  const completedCount = 7;

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await exercisesApi.getAll();
        setTotalExercises(data.exercices?.length || 0);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };
    fetchExercises();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-xl text-gray-600">Track your learning progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user?.nom} {user?.prenom}
              </h2>
              <p className="text-gray-600 mb-6">
                {user?.role === 'etudiant' ? 'Student' : 'Teacher'}
              </p>

              <div className="w-full space-y-3">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{user?.Email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">Joined {new Date(user?.dateInscription || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-6 w-full pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">Current Level</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-blue-600">Algo1</span>
                  <span className="text-sm text-gray-600">Level 3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '65%' }} />
                </div>
                <p className="text-xs text-gray-600 mt-2">65% to next level</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Dashboard completedExercises={completedCount} totalExercises={totalExercises} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 pb-4 border-b">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-gray-900">Completed "Sum of Two Numbers"</p>
                  <p className="text-sm text-gray-600">Code Exercise - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 pb-4 border-b">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-gray-900">Completed "Variable Declaration"</p>
                  <p className="text-sm text-gray-600">QCM - 1 day ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 pb-4 border-b">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-gray-900">Started "Control Structures" course</p>
                  <p className="text-sm text-gray-600">Course - 2 days ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-gray-900">Completed "Printf Format Specifier"</p>
                  <p className="text-sm text-gray-600">QCM - 3 days ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Achievements</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🏆</span>
                </div>
                <p className="text-xs text-center text-gray-700 font-medium">First Steps</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-xs text-center text-gray-700 font-medium">Quick Learner</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">💻</span>
                </div>
                <p className="text-xs text-center text-gray-700 font-medium">Code Master</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg opacity-50">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🔒</span>
                </div>
                <p className="text-xs text-center text-gray-700 font-medium">Locked</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg opacity-50">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🔒</span>
                </div>
                <p className="text-xs text-center text-gray-700 font-medium">Locked</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg opacity-50">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🔒</span>
                </div>
                <p className="text-xs text-center text-gray-700 font-medium">Locked</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
