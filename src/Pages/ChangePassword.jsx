import React, { useContext, useState } from 'react'
import { tokenContext } from '../Context/TokenContext'
import { BaseUrl } from '../env/env.environment'
import axios from 'axios'

export default function ChangePassword() {
    const { userToken } = useContext(tokenContext);
    const [ formData, setFormData ] = useState({
        currentPassword: '',
        newPassword: '',
        rePassword: '',
    });
    const [ isLoading, setIsLoading ] = useState(false);
    const [ message, setMessage ] = useState(null);
    const [ error, setError ] = useState(null);

    function handleChange(e) {
        setFormData({ ...formData, [ e.target.name ]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (formData.newPassword !== formData.rePassword) {
            setError("Passwords don't match");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.patch(
                `${BaseUrl}/users/change-password`,
                formData,
                { headers: { token: userToken } }
            );
            setMessage("Password changed successfully!");
            setFormData({ currentPassword: '', newPassword: '', rePassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change password");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex py-12 items-center flex-col min-h-screen bg-violet-100">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Change Password</h1>
                    <p className="text-gray-500 mb-6">Enter your current password and choose a new one</p>

                    {message && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
                            ✓ {message}
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
                            ✕ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                                placeholder="Enter new password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                name="rePassword"
                                value={formData.rePassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                                placeholder="Confirm new password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
