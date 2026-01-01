const API_BASE_URL = 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const coursesApi = {
  getAll: async (myCoursesOnly = false) => {
    const url = myCoursesOnly
      ? `${API_BASE_URL}/courses?my=true`
      : `${API_BASE_URL}/courses`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  getEnrolled: async () => {
    const response = await fetch(`${API_BASE_URL}/courses/enrolled`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch enrolled courses');
    return response.json();
  },

  create: async (courseData: any) => {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Failed to create course');
    return response.json();
  },

  update: async (id: number, courseData: any) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Failed to update course');
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete course');
    return response.json();
  },

  enroll: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}/enroll`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to enroll in course');
    return response.json();
  },

  finish: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}/finish`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to finish course');
    return response.json();
  },

  updateProgress: async (id: number, progress: number) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}/progress`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ progress }),
    });
    if (!response.ok) throw new Error('Failed to update progress');
    return response.json();
  },

  updateConcentration: async (id: number, focusTime: number, totalTime: number) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}/concentration`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ focusTime, totalTime }),
    });
    if (!response.ok) throw new Error('Failed to update concentration time');
    return response.json();
  },
};

export const exercisesApi = {
  getAll: async (myExercisesOnly = false) => {
    const url = myExercisesOnly
      ? `${API_BASE_URL}/exercises?my=true`
      : `${API_BASE_URL}/exercises`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch exercises');
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/exercises/${id}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch exercise');
    return response.json();
  },

  getEnrolled: async () => {
    const response = await fetch(`${API_BASE_URL}/exercises/enrolled`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch enrolled exercises');
    return response.json();
  },

  create: async (exerciseData: any) => {
    const response = await fetch(`${API_BASE_URL}/exercises`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(exerciseData),
    });
    if (!response.ok) throw new Error('Failed to create exercise');
    return response.json();
  },

  update: async (id: number, exerciseData: any) => {
    const response = await fetch(`${API_BASE_URL}/exercises/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(exerciseData),
    });
    if (!response.ok) throw new Error('Failed to update exercise');
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/exercises/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete exercise');
    return response.json();
  },

  enroll: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/exercises/${id}/enroll`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to enroll in exercise');
    return response.json();
  },
};

export const profileApi = {
  get: async () => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  completeExercise: async (id: number, score: number) => {
    const response = await fetch(`${API_BASE_URL}/profile/exercises/${id}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ score }),
    });
    if (!response.ok) throw new Error('Failed to complete exercise');
    return response.json();
  },

  completeCourse: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/profile/courses/${id}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to complete course');
    return response.json();
  },
};

export const statisticsApi = {
  getTeacherStats: async (teacherId: number) => {
    const response = await fetch(`${API_BASE_URL}/statistics/teacher/${teacherId}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch teacher statistics');
    return response.json();
  },

  getCoursePerformance: async (teacherId: number) => {
    const response = await fetch(`${API_BASE_URL}/statistics/courses/${teacherId}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch course performance');
    return response.json();
  },

  getProgressDistribution: async (teacherId: number) => {
    const response = await fetch(`${API_BASE_URL}/statistics/progress/${teacherId}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch progress distribution');
    return response.json();
  },

  getRecentActivity: async (teacherId: number) => {
    const response = await fetch(`${API_BASE_URL}/statistics/activity/${teacherId}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch recent activity');
    return response.json();
  },
};

export const teachersApi = {
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch teacher profile');
    return response.json();
  },
};
