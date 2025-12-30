import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface CourseModalProps {
  show: boolean;
  editingCourse: any | null;
  onClose: () => void;
  onSave: (course: any) => void;
}

function CourseModal({
  show,
  editingCourse,
  onClose,
  onSave,
}: CourseModalProps) {
  const [sections, setSections] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);

  useEffect(() => {
    if (show) {
      setSections(editingCourse?.content || []);
      setTopics(editingCourse?.topics || []);
    }
  }, [show, editingCourse]);

  if (!show) return null;

  const addSection = () => {
    setSections([
      ...sections,
      {
        idSection: Date.now(),
        section: '',
        theorie: '',
        codeExample: '',
      },
    ]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: string, value: string) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const addTopic = () => {
    setTopics([...topics, { idTopic: Date.now(), nom: '' }]);
  };

  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const updateTopic = (index: number, value: string) => {
    const updated = [...topics];
    updated[index].nom = value;
    setTopics(updated);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const courseData = {
      idCours: editingCourse?.idCours || parseInt(formData.get('idCours') as string),
      titre: formData.get('titre') as string,
      niveau: formData.get('niveau') as string,
      description: formData.get('description') as string,
      duree: formData.get('duree') as string,
      sections: sections.filter(s => s.section && s.theorie),
      topics: topics.filter(t => t.nom),
    };

    onSave(courseData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">
          {editingCourse ? 'Modifier le cours' : 'Ajouter un cours'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingCourse && (
            <div>
              <label className="block text-sm font-medium mb-1">ID du cours</label>
              <input
                type="number"
                name="idCours"
                required
                placeholder="ID unique du cours"
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <input
              name="titre"
              defaultValue={editingCourse?.titre}
              required
              placeholder="Titre du cours"
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Niveau</label>
            <select
              name="niveau"
              defaultValue={editingCourse?.niveau || 'Algo1'}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Algo1">Algo 1</option>
              <option value="Algo2">Algo 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Durée</label>
            <input
              name="duree"
              defaultValue={editingCourse?.duree}
              placeholder="Ex: 2 heures, 4 semaines"
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              defaultValue={editingCourse?.description}
              required
              rows={3}
              placeholder="Description du cours"
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Topics</label>
              <button
                type="button"
                onClick={addTopic}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus size={16} />
                Ajouter un topic
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {topics.map((topic, index) => (
                <div key={topic.idTopic} className="flex gap-2">
                  <input
                    type="text"
                    value={topic.nom}
                    onChange={(e) => updateTopic(index, e.target.value)}
                    placeholder="Nom du topic"
                    className="flex-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeTopic(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {topics.length === 0 && (
                <p className="text-sm text-gray-500">Aucun topic ajouté</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Sections du cours</label>
              <button
                type="button"
                onClick={addSection}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus size={16} />
                Ajouter une section
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
              {sections.map((section, index) => (
                <div key={section.idSection} className="border-l-4 border-blue-500 pl-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm">Section {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={section.section}
                    onChange={(e) => updateSection(index, 'section', e.target.value)}
                    placeholder="Titre de la section"
                    className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={section.theorie}
                    onChange={(e) => updateSection(index, 'theorie', e.target.value)}
                    placeholder="Théorie / Explication"
                    rows={3}
                    className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={section.codeExample}
                    onChange={(e) => updateSection(index, 'codeExample', e.target.value)}
                    placeholder="Exemple de code (optionnel)"
                    rows={3}
                    className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
              ))}
              {sections.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Aucune section ajoutée. Cliquez sur "Ajouter une section" pour commencer.
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourseModal;
