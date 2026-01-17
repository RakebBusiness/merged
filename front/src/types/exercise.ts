export type ExerciseType = 'qcm' | 'quiz' | 'code';

export interface QcmOption {
  id?: number;
  exercise_id?: number;
  option_text: string;
}

export interface BaseExercise {
  id: number;
  title: string;
  type: ExerciseType;
  statement: string;
  idEnseignant?: number;
  idCours?: number;
}

export interface QcmExercise extends BaseExercise {
  type: 'qcm';
  options: QcmOption[];
  correctOptionIndex: number;
}

export interface QuizExercise extends BaseExercise {
  type: 'quiz';
  answer: string;
}

export interface CodeExercise extends BaseExercise {
  type: 'code';
  answer: string;
}

export type Exercise = QcmExercise | QuizExercise | CodeExercise;

export interface ExerciseFormData {
  title: string;
  type: ExerciseType;
  statement: string;
  idCours?: number;
  options?: string[];
  correctOptionIndex?: number;
  answer?: string;
}
