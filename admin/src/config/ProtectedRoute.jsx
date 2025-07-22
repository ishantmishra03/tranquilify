import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, isLoading } = useAppContext();

   
    if (isLoading) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to='/' replace={true} />;
    }

    return children;
};

export default ProtectedRoute;
