import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    
    if (!isAuthenticated) {
        return <Navigate to='/auth' replace={true} />;
    }

    return children;
};

export default ProtectedRoute;