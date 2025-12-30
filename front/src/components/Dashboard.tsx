import { BookOpen, CheckCircle, Award, TrendingUp } from 'lucide-react';
import StatsCard from './StatsCard';

interface DashboardProps {
  completedExercises: number;
  totalExercises: number;
}

export default function Dashboard({ completedExercises, totalExercises }: DashboardProps) {
  const progress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={CheckCircle}
          value={completedExercises}
          label="Completed Exercises"
          color="bg-green-500"
        />
        <StatsCard
          icon={BookOpen}
          value={totalExercises}
          label="Total Exercises"
          color="bg-blue-500"
        />
        <StatsCard
          icon={TrendingUp}
          value={`${progress}%`}
          label="Progress"
          color="bg-orange-500"
        />
        <StatsCard
          icon={Award}
          value={Math.floor(completedExercises / 3)}
          label="Achievements"
          color="bg-purple-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Progress Overview</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-700 font-medium">QCM</span>
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {Math.floor(completedExercises * 0.4)}
              </p>
              <p className="text-xs text-purple-600">Completed</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-700 font-medium">Quiz</span>
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {Math.floor(completedExercises * 0.3)}
              </p>
              <p className="text-xs text-blue-600">Completed</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-700 font-medium">Code</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">
                {Math.floor(completedExercises * 0.3)}
              </p>
              <p className="text-xs text-green-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Keep Going!</h3>
        <p className="text-blue-100 mb-4">
          You're making great progress. Complete more exercises to unlock achievements!
        </p>
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-blue-400 rounded-full h-2">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${(completedExercises % 10) * 10}%` }}
            />
          </div>
          <span className="text-sm font-medium">{10 - (completedExercises % 10)} to next badge</span>
        </div>
      </div>
    </div>
  );
}
