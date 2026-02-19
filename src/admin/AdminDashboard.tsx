import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell } from
'recharts';
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  Calendar } from
'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
export function AdminDashboard() {
  const { stats, orders } = useOrders();
  const { products } = useProducts();
  // Prepare chart data (Last 7 days revenue)
  const chartData = useMemo(() => {
    const days = 7;
    const data = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'short'
      });
      // Calculate revenue for this day
      const dayRevenue = orders.
      filter((o) => new Date(o.date).toDateString() === date.toDateString()).
      reduce((sum, o) => sum + o.total, 0);
      data.push({
        name: dateStr,
        revenue: dayRevenue
      });
    }
    return data;
  }, [orders]);
  // Top products calculation
  const topProducts = useMemo(() => {
    const productCounts: Record<
      string,
      {
        name: string;
        count: number;
        revenue: number;
      }> =
    {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productCounts[item.productId]) {
          productCounts[item.productId] = {
            name: item.name,
            count: 0,
            revenue: 0
          };
        }
        productCounts[item.productId].count += item.quantity;
        productCounts[item.productId].revenue += item.price * item.quantity;
      });
    });
    return Object.values(productCounts).
    sort((a, b) => b.count - a.count).
    slice(0, 5);
  }, [orders]);
  const StatCard = ({ title, value, icon: Icon, trend }: any) =>
  <GlassCard className="p-6 flex items-start justify-between">
      <div>
        <p className="text-white/50 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold font-display">{value}</h3>
        {trend &&
      <div className="flex items-center gap-1 text-green-400 text-xs mt-2">
            <TrendingUp className="w-3 h-3" />
            <span>{trend}</span>
          </div>
      }
      </div>
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <Icon className="w-5 h-5 text-primary-cyan" />
      </div>
    </GlassCard>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
        <p className="text-white/60">Overview of your store's performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`}
          icon={DollarSign}
          trend="+12.5% from last month" />

        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          trend="+5 new today" />

        <StatCard
          title="Avg. Order Value"
          value={`$${stats.averageOrderValue.toFixed(2)}`}
          icon={Calendar} />

        <StatCard
          title="Active Products"
          value={products.length}
          icon={Package} />

      </div>

      {/* Charts & Tables */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-bold mb-6">Revenue Overview</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false} />

                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.4)"
                    tick={{
                      fill: 'rgba(255,255,255,0.4)',
                      fontSize: 12
                    }}
                    axisLine={false}
                    tickLine={false} />

                  <YAxis
                    stroke="rgba(255,255,255,0.4)"
                    tick={{
                      fill: 'rgba(255,255,255,0.4)',
                      fontSize: 12
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`} />

                  <Tooltip
                    cursor={{
                      fill: 'rgba(255,255,255,0.05)'
                    }}
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff'
                    }} />

                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) =>
                    <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
                    )}
                  </Bar>
                  <defs>
                    <linearGradient
                      id="colorGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">

                      <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#8B5CF6"
                        stopOpacity={0.8} />

                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-bold mb-6">Top Products</h3>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {topProducts.map((product, i) =>
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">

                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-xs text-white/50">
                      {product.count} sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-cyan">
                      ${product.revenue.toFixed(0)}
                    </p>
                  </div>
                </div>
              )}
              {topProducts.length === 0 &&
              <p className="text-white/40 text-center py-10">
                  No sales data yet
                </p>
              }
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Recent Orders */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-sm">
                <th className="pb-4 font-medium">Order ID</th>
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Total</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.recentOrders.map((order) =>
              <tr
                key={order.id}
                className="group hover:bg-white/5 transition-colors">

                  <td className="py-4 font-mono text-sm text-primary-cyan group-hover:text-primary-purple transition-colors">
                    #{order.id}
                  </td>
                  <td className="py-4">
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-xs text-white/40">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="py-4 text-white/60 text-sm">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 font-bold">${order.total.toFixed(2)}</td>
                  <td className="py-4">
                    <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : order.status === 'processing' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-white/10 text-white/60 border-white/10'}`}>

                      {order.status.charAt(0).toUpperCase() +
                    order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>);

}