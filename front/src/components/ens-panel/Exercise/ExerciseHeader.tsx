// pages/ens-panel/components/exercises/ExerciseHeader.tsx
import { Plus, Download, Upload } from 'lucide-react';

interface ExerciseHeaderProps {
  onAdd: () => void;
  onExport?: () => void;
  onImport?: () => void;
  stats: {
    total: number;
    qcm: number;
    quiz: number;
    code: number;
  };
}

const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({ 
  onAdd, 
  onExport, 
  onImport,
  stats 
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Gestion des exercices
          </h1>
          <p className="text-gray-600">
            Créez et gérez vos exercices d'algorithmique
          </p>
          
          <div className="flex gap-4 mt-4">
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-lg font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="px-3 py-2 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600">QCM</div>
              <div className="text-lg font-bold text-purple-700">{stats.qcm}</div>
            </div>
            <div className="px-3 py-2 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600">Quiz</div>
              <div className="text-lg font-bold text-green-700">{stats.quiz}</div>
            </div>
            <div className="px-3 py-2 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600">Code</div>
              <div className="text-lg font-bold text-blue-700">{stats.code}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onAdd}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            Nouvel exercice
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={18} />
              Exporter
            </button>
            <button
              onClick={onImport}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload size={18} />
              Importer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseHeader;