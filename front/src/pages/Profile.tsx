import { User, Mail, Calendar } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { profileApi } from '../services/api';

interface ProfileData {
  profile: {
    idUser: number;
    nom: string;
    prenom: string;
    email: string;
    dateNaissance: string;
    specialite: string;
    annee: number;
    level: number;
    xp: number;
    xpToNextLevel: number;
  };
  statistics: {
    totalCoursesEnrolled: number;
    coursesCompleted: number;
    totalExercisesEnrolled: number;
    exercisesCompleted: number;
    averageScore: string;
    progressPercentage: number;
  };
  courses: {
    completed: any[];
    inProgress: any[];
  };
  exercises: {
    completed: any[];
    inProgress: any[];
  };
  achievements: {
    unlocked: Array<{
      idAchievement: number;
      name: string;
      description: string;
      icon: string;
      xpReward: number;
      unlockedAt: string;
    }>;
    locked: Array<{
      idAchievement: number;
      name: string;
      description: string;
      icon: string;
      xpReward: number;
    }>;
    totalUnlocked: number;
    totalAvailable: number;
  };
}

export default function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await profileApi.get();
        setProfileData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load profile'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { profile, statistics, achievements } = profileData;
  const progressToNextLevel = ((profile.xp % 100) / 100) * 100;

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
                {profile.nom} {profile.prenom}
              </h2>
              <p className="text-gray-600 mb-6">Student</p>

              <div className="w-full space-y-3">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">Year {profile.annee} - {profile.specialite}</span>
                </div>
              </div>

              <div className="mt-6 w-full pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3">Current Level</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-blue-600">{profile.xp} XP</span>
                  <span className="text-sm text-gray-600">Level {profile.level}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressToNextLevel}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">{profile.xpToNextLevel} XP to next level</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Dashboard
              completedExercises={statistics.exercisesCompleted}
              totalExercises={statistics.totalExercisesEnrolled}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {profileData.exercises.completed.slice(0, 4).map((exercise: any, index: number) => (
                <div key={exercise.idExercice || index} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-gray-900">Completed "{exercise.Titre}"</p>
                    <p className="text-sm text-gray-600">
                      {exercise.Type} - Score: {exercise.score || 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
              {profileData.courses.inProgress.slice(0, 2).map((course: any) => (
                <div key={course.idCours} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium text-gray-900">In Progress "{course.Titre}"</p>
                    <p className="text-sm text-gray-600">Course - {course.progress}% complete</p>
                  </div>
                </div>
              ))}
              {profileData.exercises.completed.length === 0 && profileData.courses.inProgress.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent activity yet</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Achievements ({achievements.totalUnlocked}/{achievements.totalAvailable})
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {achievements.unlocked.map((achievement) => (
                <div
                  key={achievement.idAchievement}
                  className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg"
                  title={achievement.description}
                >
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">{achievement.icon}</span>
                  </div>
                  <p className="text-xs text-center text-gray-700 font-medium">{achievement.name}</p>
                </div>
              ))}
              {achievements.locked.map((achievement) => (
                <div
                  key={achievement.idAchievement}
                  className="flex flex-col items-center p-4 bg-gray-100 rounded-lg opacity-50"
                  title={achievement.description}
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">{achievement.icon}</span>
                  </div>
                  <p className="text-xs text-center text-gray-700 font-medium">{achievement.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
