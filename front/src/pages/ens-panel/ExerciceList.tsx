import { useState, useEffect } from 'react';
import { exercisesApi } from '../../services/api';
import { Exercise } from '../../types/exercise';
import ExerciseHeader from '../../components/ens-panel/Exercise/ExerciseHeader';
import ExerciseFilters from '../../components/ens-panel/Exercise/ExerciseFilters';
import ExerciseCard from '../../components/ens-panel/Exercise/ExerciseCard';
import ExerciseModal from '../../components/ens-panel/Exercise/ExerciseModal';

function ExerciseList() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'qcm' | 'quiz' | 'code'>('all');

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchQuery, filterType]);

  // Transformation des données API pour correspondre au type Exercise
  const fetchExercises = async () => {
    try {
      setLoading(true);
      const data = await exercisesApi.getAll(true);

      const formatted = (data || []).map((ex: any) => {
        let type: 'qcm' | 'quiz' | 'code' = 'qcm';
        if (ex.Type === 'Multiple choice') type = 'qcm';
        else if (ex.Type === 'Quiz') type = 'quiz';
        else if (ex.Type === 'Code') type = 'code';

        const base = {
          id: Number(ex.idExercice),
          title: ex.titre,
          statement: ex.enonce,
          type,
          idCours: ex.idCours,
          idEnseignant: ex.idEnseignant,
        };

        if (type === 'qcm') {
          return {
            ...base,
            options: ex.options?.map((o: string) => ({ option_text: o })) || [],
            correctOptionIndex: ex.correctOptionIndex ?? 0
          };
        }

        if (type === 'quiz') {
          return {
            ...base,
            answer: ex.correctAnswer || ''
          };
        }

        if (type === 'code') {
          return {
            ...base,
            tests: ex.tests || []
          };
        }

        return base;
      }) as Exercise[];

      setExercises(formatted);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    if (filterType !== 'all') {
      filtered = filtered.filter(ex => ex.type === filterType);
    }

    if (searchQuery) {
      filtered = filtered.filter(ex =>
        ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.statement.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExercises(filtered);
  };

  const getStats = () => ({
    total: exercises.length,
    qcm: exercises.filter(ex => ex.type === 'qcm').length,
    quiz: exercises.filter(ex => ex.type === 'quiz').length,
    code: exercises.filter(ex => ex.type === 'code').length,
  });

  const handleAdd = () => {
    setEditingExercise(null);
    setShowModal(true);
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer cet exercice ?')) {
      try {
        await exercisesApi.delete(id);
        fetchExercises();
      } catch (error) {
        console.error('Error deleting exercise:', error);
        alert('Erreur lors de la suppression de l\'exercice');
      }
    }
  };

  const handleSave = async (exerciseData: any) => {
    try {
      if (editingExercise) {
        await exercisesApi.update(editingExercise.id, exerciseData);
      } else {
        await exercisesApi.create(exerciseData);
      }
      setShowModal(false);
      fetchExercises();
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert('Erreur lors de l\'enregistrement de l\'exercice');
    }
  };

  const handleSearch = (query: string) => setSearchQuery(query);
  const handleFilterChange = (type: 'all' | 'qcm' | 'quiz' | 'code') => setFilterType(type);

  if (loading) return <div className="text-center py-8">Chargement des exercices...</div>;

  const stats = getStats();

  return (
    <div className="space-y-6">
      <ExerciseHeader onAdd={handleAdd} stats={stats} />

      <ExerciseFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        currentType={filterType}
        stats={stats}
      />

      <div className="grid md:grid-cols-2 gap-4">
        {filteredExercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center text-gray-600 py-12">
          {searchQuery || filterType !== 'all'
            ? 'Aucun exercice ne correspond à vos critères'
            : 'Aucun exercice disponible'}
        </div>
      )}

      <ExerciseModal
        show={showModal}
        editingExercise={editingExercise}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default ExerciseList;
