import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import useAxios from './useAxios';


const useUserRole = () => {
    const { user, loading } = useAuth();
    const [role, setRole] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);
    const axiosSecure = useAxios()

    useEffect(() => {
        if (user?.email && !loading) {
            const fetchRole = async () => {
                try {
                    const response = await axiosSecure.get(`/api/users/email/${user.email}`);
                    setRole(response.data.data.role);
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setRole('user'); // Default to user role
                } finally {
                    setRoleLoading(false);
                }
            };
            fetchRole();
        } else if (!loading && !user) {
            setRoleLoading(false);
        }
    }, [user, loading, axiosSecure]);

    return { role, roleLoading };
};

export default useUserRole;