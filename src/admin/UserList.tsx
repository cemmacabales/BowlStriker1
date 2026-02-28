import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { GlassCard } from '../components/GlassCard';
import { Shield, ShieldAlert, User as UserIcon, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserProfile {
    id: string;
    email: string;
    is_admin: boolean;
    created_at: string;
}

export function UserList() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user: currentUser } = useAuth(); // To prevent demoting ourselves

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data, error: fetchError } = await supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            // Map data ensuring boolean
            const mappedUsers = (data || []).map(u => ({
                ...u,
                is_admin: u.is_admin === true || u.is_admin === 'true'
            }));
            setUsers(mappedUsers);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleAdmin = async (userId: string, currentStatus: boolean, email: string) => {
        // Safety check to prevent users from accidentally removing their own admin rights
        if (userId === currentUser?.id) {
            alert("You cannot remove your own admin privileges.");
            return;
        }

        const action = currentStatus ? "remove admin rights from" : "grant admin rights to";
        if (!window.confirm(`Are you sure you want to ${action} ${email}?`)) {
            return;
        }

        try {
            const { error: updateError } = await supabase
                .from('user_profiles')
                .update({ is_admin: !currentStatus })
                .eq('id', userId);

            if (updateError) throw updateError;

            // Optimistically update UI
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_admin: !currentStatus } : u));
        } catch (err) {
            console.error('Error updating user role:', err);
            alert('Failed to update user role.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold mb-2">User Management</h1>
                    <p className="text-white/60">Manage accounts and administrator privileges</p>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-4 text-sm font-medium text-white/50">User ID</th>
                                <th className="p-4 text-sm font-medium text-white/50">Email / Account</th>
                                <th className="p-4 text-sm font-medium text-white/50">Role</th>
                                <th className="p-4 text-sm font-medium text-white/50">Joined Date</th>
                                <th className="p-4 text-sm font-medium text-white/50 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono text-xs text-white/40">
                                        {user.id.substring(0, 8)}...
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                                <UserIcon className="w-4 h-4 text-white/60" />
                                            </div>
                                            <span className="font-medium text-sm">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {user.is_admin ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                                <Shield className="w-3 h-3" />
                                                Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white/60 border border-white/10">
                                                Customer
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-white/60">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => toggleAdmin(user.id, user.is_admin, user.email)}
                                            disabled={user.id === currentUser?.id}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${user.id === currentUser?.id
                                                    ? 'opacity-50 cursor-not-allowed border-white/10 bg-white/5 text-white/40'
                                                    : user.is_admin
                                                        ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                                        : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                                                }`}
                                        >
                                            {user.id === currentUser?.id ? 'Current User' : user.is_admin ? 'Revoke Admin' : 'Make Admin'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-white/40">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
