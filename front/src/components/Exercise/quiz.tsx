import React, { useState } from 'react';

interface QuizProps {
  exercise: {
    idExercice: string;
    titre: string;
    enonce: string;
    Type: string;
    options?: string[];
    correctAnswer?: string;
  };
  onComplete: () => void;
}

const Quiz: React.FC<QuizProps> = ({ exercise, onComplete }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleSubmit = () => {
    if (exercise.Type === 'Multiple choice') {
      const correct = selectedOption === exercise.correctAnswer;
      setIsCorrect(correct);
      setSubmitted(true);
      
      if (correct) {
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    } else if (exercise.Type === 'Text Answer') {
      // Pour les réponses textuelles, on considère que c'est correct si non vide
      const correct = textAnswer.trim().length > 0;
      setIsCorrect(correct);
      setSubmitted(true);
      
      if (correct) {
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {exercise.titre}
      </h2>
      
      <p className="text-gray-700 mb-6 whitespace-pre-wrap">
        {exercise.enonce}
      </p>

      {exercise.Type === 'Multiple choice' && exercise.options && (
        <div className="space-y-3 mb-6">
          {exercise.options.map((option, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedOption === option
                  ? 'bg-blue-50 border-blue-500'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedOption(option)}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                  selectedOption === option
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-400'
                }`}>
                  {selectedOption === option && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-gray-800">{option}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {exercise.Type === 'Text Answer' && (
        <div className="mb-6">
          <textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your answer here..."
          />
        </div>
      )}

      {submitted && (
        <div className={`p-4 rounded-lg mb-6 ${
          isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {isCorrect 
            ? 'Correct! Moving to next exercise...' 
            : 'Incorrect answer. Please try again.'}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={
          (exercise.Type === 'Multiple choice' && !selectedOption) ||
          (exercise.Type === 'Text Answer' && !textAnswer.trim())
        }
        className={`px-6 py-3 rounded-lg font-medium ${
          submitted && isCorrect
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white disabled:bg-gray-400 disabled:cursor-not-allowed`}
      >
        {submitted && isCorrect ? 'Completed!' : 'Submit Answer'}
      </button>
    </div>
  );
};

export default Quiz;