import React, { useState, useEffect } from 'react';
import { FaSpinner, FaUsers, FaTrash, FaStar, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxios from '../../../Hooks/useAxios';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const axiosInstance = useAxios();

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/api/users');
            if (response.data.success) {
                setUsers(response.data.data);
                setFilteredUsers(response.data.data); // Initialize filtered users
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            Swal.fire('Error!', 'Failed to load user data.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (users) {
            const lowercasedFilter = searchTerm.toLowerCase();
            const filteredData = users.filter(user =>
                user.name.toLowerCase().includes(lowercasedFilter) ||
                user.email.toLowerCase().includes(lowercasedFilter)
            );
            setFilteredUsers(filteredData);
        }
    }, [searchTerm, users]);


    const handleRoleChange = async (user) => {
        const newRole = user.role === 'top-customer' ? 'user' : 'top-customer';

        Swal.fire({
            title: `Change role to ${newRole}?`,
            text: `Do you want to change ${user.name}'s role?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosInstance.put(`/api/users/${user.id}`, { role: newRole });
                    if (response.data.success) {
                        Swal.fire('Updated!', `${user.name}'s role has been updated.`, 'success');
                        fetchUsers(); // Refresh user list
                    }
                } catch (error) {
                    console.error("Failed to update role:", error);
                    Swal.fire('Error!', 'Failed to update user role.', 'error');
                }
            }
        });
    };

    const handleDeleteUser = (user) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${user.name}. This cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosInstance.delete(`/api/users/${user.id}`);
                    if (response.data.success) {
                        Swal.fire('Deleted!', 'The user has been deleted.', 'success');
                        fetchUsers();
                    }
                } catch (error) {
                    console.error("Failed to delete user:", error);
                    Swal.fire('Error!', 'Failed to delete user.', 'error');
                }
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-4xl text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-base-200 min-h-screen">
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                 <h1 className="text-4xl font-bold text-base-content">All Users ({users.length})</h1>
                 <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="input input-bordered w-full max-w-xs pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                    <FaUsers className="text-6xl text-gray-400 mx-auto mb-4" />
                    <p className="text-xl">
                        {searchTerm ? `No users found for "${searchTerm}"` : "No users found."}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={user.id}>
                                    <th>{index + 1}</th>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={user.image} alt={`${user.name}'s avatar`} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge badge-ghost badge-sm capitalize ${user.role === 'admin' ? 'badge-secondary' : user.role === 'top-customer' ? 'badge-primary' : ''}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className='space-x-2'>
                                        <button
                                            onClick={() => handleRoleChange(user)}
                                            className={`btn btn-ghost btn-sm ${user.role === 'top-customer' ? 'text-yellow-500' : ''}`}
                                            title={user.role === 'top-customer' ? 'Remove Top Customer' : 'Make Top Customer'}
                                            disabled={user.role === 'admin'}
                                        >
                                            <FaStar />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user)}
                                            className="btn btn-ghost btn-sm text-red-500"
                                            title="Delete User"
                                            disabled={user.role === 'admin'}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AllUsers;

