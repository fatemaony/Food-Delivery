import React, { useState, useEffect } from 'react';
import useAxios from '../../../Hooks/useAxios';
import { FaUsers, FaUtensils, FaBox, FaMoneyBillWave, FaSpinner } from 'react-icons/fa';

// A reusable card component for displaying stats
const StatCard = ({ icon, title, value, classes }) => {
    return (
        <div className={`p-6 rounded-lg shadow-lg ${classes.bg}`}>
            <div className="flex items-center">
                <div className={`p-4 rounded-full mr-4 ${classes.iconBg}`}>
                    {React.cloneElement(icon, { className: `text-3xl ${classes.icon}` })}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600 uppercase">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
};

const AdminHome = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const axiosInstance = useAxios();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosInstance.get('/api/stats');
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [axiosInstance]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-4xl text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-10 py-5 bg-base-200 min-h-screen">
            <h1 className="text-4xl font-bold mb-5 text-base-content">Admin Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <StatCard
                    icon={<FaUsers />}
                    title="Total Users"
                    value={stats ? stats.users : 0}
                    classes={{
                        bg: 'bg-blue-100 border-l-4 border-blue-500',
                        icon: 'text-blue-600',
                        iconBg: 'bg-blue-200'
                    }}
                />
                <StatCard
                    icon={<FaUtensils />}
                    title="Total Products"
                    value={stats ? stats.products : 0}
                    classes={{
                        bg: 'bg-green-100 border-l-4 border-green-500',
                        icon: 'text-green-600',
                        iconBg: 'bg-green-200'
                    }}
                />
                <StatCard
                    icon={<FaBox />}
                    title="Total Orders"
                    value={stats ? stats.orders : 0}
                    classes={{
                        bg: 'bg-purple-100 border-l-4 border-purple-500',
                        icon: 'text-purple-600',
                        iconBg: 'bg-purple-200'
                    }}
                />
                <StatCard
                    icon={<FaMoneyBillWave />}
                    title="Total Revenue"
                    value={stats ? `$${stats.revenue.toFixed(2)}` : '$0.00'}
                    classes={{
                        bg: 'bg-yellow-100 border-l-4 border-yellow-500',
                        icon: 'text-yellow-600',
                        iconBg: 'bg-yellow-200'
                    }}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 pt-3 gap-5">
                    {/* Quick Stats Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                            Performance
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Growth Rate</span>
                                <span className="font-bold text-green-600">+18%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Active Sessions</span>
                                <span className="font-bold text-blue-600">1.2K</span>
                            </div>
                        </div>
                    </div>

                    {/* Welcome Card */}
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white md:col-span-2">
                        <h3 className="text-xl font-bold mb-2">Business Insights</h3>
                        <p className="opacity-90 mb-4">Your platform is performing excellently with consistent growth across all metrics.</p>
                        <div className="flex items-center">
                            <div className="bg-amber-400 bg-opacity-30 p-2 rounded-lg mr-3">
                                📈
                            </div>
                            <span className="text-sm">Trending upward this month</span>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default AdminHome;
