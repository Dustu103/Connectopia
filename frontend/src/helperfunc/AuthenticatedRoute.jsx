import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'; // Adjust the import path accordingly

const AuthenticatedRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    if (isAuthenticated) {
        return children; // If authenticated, return the children components
    } else {
        return <Navigate to="/" />; // Redirect to login if not authenticated
    }
};

export default AuthenticatedRoute;
