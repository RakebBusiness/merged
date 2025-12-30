import { Users, BookOpen, FileText, TrendingUp } from 'lucide-react';

function Statistics() {
  const stats = [
    { label: 'Étudiants inscrits', value: '247', icon: Users, color: 'bg-blue-500', change: '+12%' },
    { label: 'Cours publiés', value: '18', icon: BookOpen, color: 'bg-green-500', change: '+3' },
    { label: 'Exercices disponibles', value: '64', icon: FileText, color: 'bg-purple-500', change: '+8' },
    { label: 'Taux de réussite', value: '78%', icon: TrendingUp, color: 'bg-orange-500', change: '+5%' },
  ];

  const coursesData = [
    { name: 'Introduction aux algorithmes', students: 189, completion: 85 },
    { name: 'Structures de données', students: 156, completion: 72 },
    { name: 'Complexité algorithmique', students: 134, completion: 68 },
    { name: 'Algorithmes de tri', students: 142, completion: 75 },
    { name: 'Récursivité', students: 98, completion: 58 },
  ];

  const progressData = [
    { label: 'Ont terminé tous les cours', value: 45, color: 'bg-green-500' },
    { label: 'En progression', value: 152, color: 'bg-blue-500' },
    { label: 'Juste commencé', value: 50, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-2 font-medium">{stat.change}</p>
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
          <div className="space-y-4">
            {coursesData.map((course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{course.name}</span>
                  <span className="text-sm text-gray-500">{course.students} étudiants</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${course.completion}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Taux de completion</span>
                  <span className="text-xs font-semibold text-blue-600">{course.completion}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Répartition des étudiants</h3>
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
                  strokeDasharray={`${(45 / 247) * 502.4} 502.4`}
                  strokeLinecap="round"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#3b82f6"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${(152 / 247) * 502.4} 502.4`}
                  strokeDashoffset={`${-(45 / 247) * 502.4}`}
                  strokeLinecap="round"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#eab308"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${(50 / 247) * 502.4} 502.4`}
                  strokeDashoffset={`${-((45 + 152) / 247) * 502.4}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-gray-900">247</span>
                <span className="text-sm text-gray-500">Étudiants</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {progressData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Activité récente</h3>
        <div className="space-y-4">
          {[
            { action: 'Nouveau cours publié', title: 'Algorithmes de tri avancés', time: 'Il y a 2 heures' },
            { action: '15 étudiants ont terminé', title: 'Introduction aux algorithmes', time: 'Il y a 5 heures' },
            { action: 'Exercice ajouté', title: 'Tri fusion - Exercice pratique', time: 'Il y a 1 jour' },
            { action: '23 étudiants ont commencé', title: 'Récursivité', time: 'Il y a 1 jour' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.title}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Statistics;
