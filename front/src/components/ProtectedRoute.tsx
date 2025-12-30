import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireTeacher?: boolean;
  requireStudent?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAuth = false,
  requireTeacher = false,
  requireStudent = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isTeacher, isStudent } = useAuth();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireTeacher && !isTeacher) {
    return <Navigate to="/" replace />;
  }

  if (requireStudent && !isStudent) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
