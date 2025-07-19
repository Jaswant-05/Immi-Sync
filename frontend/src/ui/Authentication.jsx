import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const Authentication = () => {
  const { setAuth } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setAuth({ token, role });
    }
  }, [setAuth]);

  return null;
};
