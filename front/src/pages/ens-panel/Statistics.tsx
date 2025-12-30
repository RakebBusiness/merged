import { useState, useEffect } from 'react';
import { Users, BookOpen, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { statisticsApi } from '../../services/api';

function Statistics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalExercises: 0,
    avgCompletion: 0,
  });
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [progressData, setProgressData] = useState({
    completed: 0,
    inProgress: 0,
    justStarted: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (user?.idUser) {
      fetchAllStatistics();
    }
  }, [user]);

  const fetchAllStatistics = async () => {
    try {
      setLoading(true);
      const [statsData, coursesPerf, progress, activity] = await Promise.all([
        statisticsApi.getTeacherStats(user.idUser),
        statisticsApi.getCoursePerformance(user.idUser),
        statisticsApi.getProgressDistribution(user.idUser),
        statisticsApi.getRecentActivity(user.idUser),
      ]);

      setStats(statsData);
      setCoursesData(coursesPerf);
      setProgressData(progress);
      setActivities(activity);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  };

  const statsCards = [
    { label: 'Étudiants inscrits', value: stats.totalStudents, icon: Users, color: 'bg-blue-500' },
    { label: 'Cours publiés', value: stats.totalCourses, icon: BookOpen, color: 'bg-green-500' },
    { label: 'Exercices disponibles', value: stats.totalExercises, icon: FileText, color: 'bg-orange-500' },
    { label: 'Taux moyen de progression', value: `${stats.avgCompletion}%`, icon: TrendingUp, color: 'bg-teal-500' },
  ];

  const progressArray = [
    { label: 'Ont terminé tous les cours', value: progressData.completed, color: 'bg-green-500' },
    { label: 'En progression', value: progressData.inProgress, color: 'bg-blue-500' },
    { label: 'Juste commencé', value: progressData.justStarted, color: 'bg-yellow-500' },
  ];

  const totalStudents = progressData.completed + progressData.inProgress + progressData.justStarted;

  if (loading) {
    return <div className="text-center py-8">Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Performance des cours</h3>
          {coursesData.length > 0 ? (
            <div className="space-y-4">
              {coursesData.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{course.name}</span>
                    <span className="text-sm text-gray-500">{course.students} étudiant{course.students > 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${course.completion}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Taux de progression</span>
                    <span className="text-xs font-semibold text-blue-600">{course.completion}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Aucune donnée disponible</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Répartition des étudiants</h3>
          {totalStudents > 0 ? (
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#e5e7eb"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#22c55e"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${(progressData.completed / totalStudents) * 502.4} 502.4`}
                      strokeLinecap="round"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#3b82f6"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${(progressData.inProgress / totalStudents) * 502.4} 502.4`}
                      strokeDashoffset={`${-(progressData.completed / totalStudents) * 502.4}`}
                      strokeLinecap="round"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#eab308"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${(progressData.justStarted / totalStudents) * 502.4} 502.4`}
                      strokeDashoffset={`${-((progressData.completed + progressData.inProgress) / totalStudents) * 502.4}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold text-gray-900">{totalStudents}</span>
                    <span className="text-sm text-gray-500">Étudiants</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {progressArray.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-8">Aucun étudiant inscrit</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Activité récente</h3>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.count} étudiant{activity.count > 1 ? 's ont' : ' a'} commencé
                  </p>
                  <p className="text-sm text-gray-600">{activity.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.time)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">Aucune activité récente</p>
        )}
      </div>
    </div>
  );
}

export default Statistics;
