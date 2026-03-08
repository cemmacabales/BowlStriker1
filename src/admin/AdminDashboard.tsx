import React, { useEffect, useMemo } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  Calendar,
  Users,
  Clock,
  BarChart3,
  XCircle,
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
import { supabase } from '../lib/supabase';

export function AdminDashboard() {
  const { stats, orders, fetchOrders } = useOrders();
  const { products } = useProducts();
  const [userCount, setUserCount] = React.useState(0);

  useEffect(() => {
    fetchOrders();
    fetchUserCount();
  }, []);

  const fetchUserCount = async () => {
    try {
      const { count } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });
      setUserCount(count || 0);
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };

  // Calculate today's and this week's stats
  const { todayOrders, todayRevenue, weekOrders, weekRevenue } = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const todayList = orders.filter((o) => o.date.startsWith(today));
    const todayRev = todayList
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const weekList = orders.filter((o) => o.date >= weekAgo);
    const weekRev = weekList
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    return {
      todayOrders: todayList.length,
      todayRevenue: todayRev,
      weekOrders: weekList.length,
      weekRevenue: weekRev,
    };
  }, [orders]);

  // Prepare chart data (Last 7 days revenue)
  const chartData = useMemo(() => {
    const days = 7;
    const data = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayRevenue = orders
        .filter((o) => new Date(o.date).toDateString() === date.toDateString())
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0);
      data.push({ name: dateStr, revenue: dayRevenue });
    }
    return data;
  }, [orders]);

  // Calculate per-status counts directly from orders array
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const processingOrders = orders.filter((o) => o.status === 'processing').length;
  const shippedOrders = orders.filter((o) => o.status === 'shipped').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;

  // Status distribution data
  const statusData = useMemo(() => {
    return [
      { name: 'Pending', value: orders.filter((o) => o.status === 'pending').length, color: '#eab308' },
      { name: 'Processing', value: orders.filter((o) => o.status === 'processing').length, color: '#8b5cf6' },
      { name: 'Shipped', value: orders.filter((o) => o.status === 'shipped').length, color: '#3b82f6' },
      { name: 'Delivered', value: orders.filter((o) => o.status === 'delivered').length, color: '#22c55e' },
      { name: 'Cancelled', value: orders.filter((o) => o.status === 'cancelled').length, color: '#ef4444' },
    ].filter((s) => s.value > 0);
  }, [orders]);

  const totalForBar = statusData.reduce((sum, s) => sum + s.value, 0);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₱${stats.totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Delivered',
      value: deliveredOrders,
      icon: Package,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Total Users',
      value: userCount,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'from-teal-500 to-teal-600',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
        <p className="text-white/60">Overview of your store performance</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <GlassCard key={card.title} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color}`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-white/50 text-sm">{card.title}</p>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Today & This Week */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary-cyan" />
            <h2 className="text-lg font-semibold">Today</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/50 text-sm">Orders</p>
              <p className="text-2xl font-bold">{todayOrders}</p>
            </div>
            <div>
              <p className="text-white/50 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-primary-cyan">
                ₱{todayRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">This Week</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/50 text-sm">Orders</p>
              <p className="text-2xl font-bold">{weekOrders}</p>
            </div>
            <div>
              <p className="text-white/50 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-blue-400">
                ₱{weekRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Revenue Chart (Simple Bar) */}
      <GlassCard className="p-5">
        <h2 className="text-lg font-semibold mb-4">Last 7 Days Revenue</h2>
        <div className="flex items-end gap-2 h-40">
          {chartData.map((day) => {
            const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);
            const height = (day.revenue / maxRevenue) * 100;
            return (
              <div key={day.name} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-white/40">
                  {day.revenue > 0 ? `₱${day.revenue.toFixed(0)}` : ''}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-primary-cyan to-primary-blue rounded-t-md transition-all"
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
                <span className="text-xs text-white/40">{day.name}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Order Status Breakdown */}
      {totalForBar > 0 && (
        <GlassCard className="p-5">
          <h2 className="text-lg font-semibold mb-4">Order Status Breakdown</h2>
          <div className="flex rounded-full overflow-hidden h-4 mb-4">
            {statusData.map((s) => (
              <div
                key={s.name}
                className="transition-all"
                style={{
                  width: `${(s.value / totalForBar) * 100}%`,
                  backgroundColor: s.color,
                }}
                title={`${s.name}: ${s.value}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-sm text-white/50">
                  {s.name}: {s.value}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Recent Orders */}
      <GlassCard className="p-5">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-white/40 text-center py-8">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-sm">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono text-sm text-primary-cyan">
                      #{order.id.substring(0, 8)}
                    </td>
                    <td className="py-3">
                      <div className="text-sm font-medium">{order.customer_name}</div>
                      <div className="text-xs text-white/40">{order.customer_email}</div>
                    </td>
                    <td className="py-3 text-sm text-white/60">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="py-3 font-bold text-sm">₱{order.total.toFixed(2)}</td>
                    <td className="py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full border ${
                          order.status === 'pending'
                            ? 'bg-white/10 text-white/60 border-white/10'
                            : order.status === 'processing'
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            : order.status === 'shipped'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : order.status === 'delivered'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-white/40">
                      {new Date(order.date).toLocaleDateString('en-PH', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}