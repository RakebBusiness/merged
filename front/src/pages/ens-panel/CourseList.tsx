import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { coursesApi } from '../../services/api';
import CourseModal from '../../components/ens-panel/CourseModal';

function CourseList() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await coursesApi.getAll(true);
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setShowModal(true);
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer ce cours ?')) {
      try {
        await coursesApi.delete(id);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course');
      }
    }
  };

  const handleSave = async (courseData: any) => {
    try {
      if (editingCourse) {
        await coursesApi.update(editingCourse.idCours, courseData);
      } else {
        await coursesApi.create(courseData);
      }
      setShowModal(false);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading courses...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des cours</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Ajouter
        </button>
      </div>

      <div className="grid gap-4">
        {courses.map(course => (
          <div
            key={course.idCours}
            className="bg-white border rounded-xl p-5 shadow-sm"
          >
            <h3 className="font-bold text-lg">{course.titre}</h3>
            <p className="text-sm text-gray-600">{course.description}</p>

            <div className="text-xs text-gray-500 mt-2">
              Niveau : {course.niveau}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(course)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(course.idCours)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center text-gray-600 py-8">No courses available</div>
      )}

      <CourseModal
        show={showModal}
        editingCourse={editingCourse}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default CourseList;
