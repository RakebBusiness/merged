import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  Edit2,
} from "lucide-react";
import CourseList from "./CourseList.tsx";
import ExerciseList from "./ExerciceList.tsx";
import Statistics from "./Statistics.tsx";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "courses" | "exercises"
  >("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Panel Enseignant
                </h1>
                <p className="text-sm text-gray-600">Algorithmique</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Prof. gr</p>
                <p className="text-xs text-gray-500">Enseignant</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">MD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "dashboard"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Tableau de bord
              </div>
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "courses"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Cours
              </div>
            </button>
            <button
              onClick={() => setActiveTab("exercises")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "exercises"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                Exercices
              </div>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && <Statistics />}
        {activeTab === "courses" && <CourseList />}
        {activeTab === "exercises" && <ExerciseList />}
      </main>
    </div>
  );
}

export default AdminPanel;
