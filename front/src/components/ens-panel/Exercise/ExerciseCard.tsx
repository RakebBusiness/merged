import { Trash2, Edit2, FileText, CheckCircle, Code } from 'lucide-react';
import { Exercise } from '../../../types/exercise';

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: (exercise: Exercise) => void;
  onDelete: (id: number) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onEdit, onDelete }) => {
  const getTypeInfo = () => {
    switch (exercise.type) {
      case 'qcm':
        return {
          icon: FileText,
          color: 'bg-purple-100 text-purple-800',
          label: 'QCM',
          details: `${exercise.options?.length || 0} options`
        };
      case 'quiz':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800',
          label: 'QUIZ',
          details: 'Réponse courte'
        };
      case 'code':
        return {
          icon: Code,
          color: 'bg-blue-100 text-blue-800',
          label: 'CODE',
          details: `${exercise.tests?.length || 0} tests`
        };
      default:
        return { icon: FileText, color: 'bg-gray-100 text-gray-800', label: '', details: '' };
    }
  };

  const typeInfo = getTypeInfo();
  const Icon = typeInfo.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
              <Icon className="w-3 h-3" />
              {typeInfo.label}
            </span>
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">{exercise.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{exercise.statement}</p>
        </div>

        <div className="flex gap-1 ml-2">
          <button
            onClick={() => onEdit(exercise)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Modifier"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(exercise.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {typeInfo.details}
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;