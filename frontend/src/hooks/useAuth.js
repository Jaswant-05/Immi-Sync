import { useRecoilState } from 'recoil';
import { authAtom } from '../Recoil/atoms/authAtom';

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authAtom);

  const logIn = ({ token, role }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setAuth({ token, role });
  };

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuth(null);
  };

  const isLoggedIn = !!auth?.token;

  return {
    token: auth?.token || null,
    role: auth?.role || null,
    isLoggedIn,
    logIn,
    logOut,
    setAuth,
  };
};
