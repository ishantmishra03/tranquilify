import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
    const {isAuthenticated} = useAppContext();
    
    if (!isAuthenticated) {
        return <Navigate to='/auth' replace={true} />;
    }

    return children;
};

export default ProtectedRoute;