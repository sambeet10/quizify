import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL + '/api';

export const getAllQuizzes = async () => {
  try {
    const response = await axios.get(`${API}/quiz`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

export const getQuizzesByUser = async (token) => {
  try {
    const response = await axios.get(`${API}/quiz/my-quizzes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user quizzes:', error);
    throw error;
  }
};

export const getQuizById = async (id, token) => {
  try {
    const response = await axios.get(`${API}/quiz/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    throw error;
  }
};

export const deleteQuizById = async (quizId, token) => {  
  try {
    const response = await axios.delete(`${API}/quiz/delete/${quizId}`, {  
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw error;
  }
};

export const updateQuizById = async (quizId, updatedData, token) => {  
  try {
    const response = await axios.put(`${API}/quiz/edit/${quizId}`, updatedData, { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
};

export const createQuiz = async (quizData, token) => {
    try {
      const response = await axios.post(`${API}/quiz/create`, quizData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  };
  