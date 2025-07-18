import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAppContext();

    // Show a loading indicator while auth status is being verified
    if (loading) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to='/auth' replace={true} />;
    }

    return children;
};

export default ProtectedRoute;
