import axios from 'axios';

export const getUserAttempts = async (token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/attempt/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
