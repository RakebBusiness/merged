import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Exercise, ExerciseType } from '../../../types/exercise';

interface ExerciseModalProps {
  show: boolean;
  editingExercise: Exercise | null;
  onClose: () => void;
  onSave: (exerciseData: any) => void;
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({
  show,
  editingExercise,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ExerciseType>('qcm');
  const [statement, setStatement] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (editingExercise) {
      setTitle(editingExercise.title);
      setType(editingExercise.type);
      setStatement(editingExercise.statement);

      if (editingExercise.type === 'qcm') {
        setOptions(editingExercise.options.map(opt => opt.option_text));
        setCorrectOptionIndex(editingExercise.correctOptionIndex || 0);
      } else if (editingExercise.type === 'quiz' || editingExercise.type === 'code') {
        setAnswer(editingExercise.answer);
      }
    } else {
      resetForm();
    }
  }, [editingExercise, show]);

  const resetForm = () => {
    setTitle('');
    setType('qcm');
    setStatement('');
    setOptions(['', '', '', '']);
    setCorrectOptionIndex(0);
    setAnswer('');
  };

  const handleTypeChange = (newType: ExerciseType) => {
    setType(newType);
    if (newType === 'qcm' && options.length === 0) {
      setOptions(['', '', '', '']);
    }
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    if (correctOptionIndex >= newOptions.length) {
      setCorrectOptionIndex(Math.max(0, newOptions.length - 1));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseData = {
      title,
      type,
      statement,
    };

    let exerciseData: any = baseData;

    if (type === 'qcm') {
      exerciseData = {
        ...baseData,
        options: options.filter(opt => opt.trim() !== '').map(opt => ({ option_text: opt })),
        correctOptionIndex,
      };
    } else if (type === 'quiz' || type === 'code') {
      exerciseData = {
        ...baseData,
        answer,
      };
    }

    onSave(exerciseData);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {editingExercise ? 'Modifier l\'exercice' : 'Nouvel exercice'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'exercice
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('qcm')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-colors ${
                  type === 'qcm'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                QCM
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('quiz')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-colors ${
                  type === 'quiz'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Quiz
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('code')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-colors ${
                  type === 'code'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Code
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Énoncé
            </label>
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {type === 'qcm' && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Options
                </label>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} />
                  Ajouter une option
                </button>
              </div>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctOptionIndex === index}
                      onChange={() => setCorrectOptionIndex(index)}
                      className="mt-3"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Sélectionnez la bonne réponse en cliquant sur le bouton radio
              </p>
            </div>
          )}

          {type === 'quiz' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Réponse attendue
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {type === 'code' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Réponse attendue (code)
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                placeholder="Entrez la réponse attendue pour cet exercice de code..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Entrez la solution ou le résultat attendu pour cet exercice de code
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              {editingExercise ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExerciseModal;
