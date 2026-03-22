import { useSelector } from 'react-redux';

export const useAuth = () => {
    const { user, accessToken, loading, error } = useSelector((state) => state.auth);

    return {
        user,
        userId: user?.id,
        email: user?.email,
        accessToken,
        isLoggedIn: !!accessToken,
        loading,
        error
    };
};