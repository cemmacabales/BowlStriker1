import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Eye, RefreshCw } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useOrders, Order } from '../context/OrderContext';

export function OrderList() {
  const { orders, updateOrderStatus, fetchOrders, loading } = useOrders();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'processing':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-white/10 text-white/60 border-white/10';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Orders</h1>
          <p className="text-white/60">Manage customer orders and fulfillment</p>
        </div>
        <button
          onClick={() => fetchOrders()}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <GlassCard className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-primary-cyan/50 transition-all"
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-8 text-white focus:outline-none focus:border-primary-cyan/50 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-sm">
                <th className="pb-4 font-medium pl-4">Order ID</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Items</th>
                <th className="pb-4 font-medium">Total</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="group hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 pl-4 font-mono text-sm text-primary-cyan">
                    #{order.id.substring(0, 8)}
                  </td>
                  <td className="py-4 text-white/60 text-sm">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <div className="font-medium text-white">
                      {order.customer_name}
                    </div>
                    <div className="text-xs text-white/40">
                      {order.customer_email}
                    </div>
                  </td>
                  <td className="py-4 text-white/60 text-sm">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </td>
                  <td className="py-4 font-bold text-white">
                    ₱{order.total.toFixed(2)}
                  </td>
                  <td className="py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(
                          order.id,
                          e.target.value as Order['status']
                        )
                      }
                      className={`text-xs font-medium px-2 py-1 rounded-full border appearance-none cursor-pointer outline-none ${getStatusColor(order.status)}`}
                    >
                      <option value="pending" className="bg-[#1a1a1a]">
                        Pending
                      </option>
                      <option value="processing" className="bg-[#1a1a1a]">
                        Processing
                      </option>
                      <option value="shipped" className="bg-[#1a1a1a]">
                        Shipped
                      </option>
                      <option value="delivered" className="bg-[#1a1a1a]">
                        Delivered
                      </option>
                      <option value="cancelled" className="bg-[#1a1a1a]">
                        Cancelled
                      </option>
                    </select>
                  </td>
                  <td className="py-4 text-right pr-4">
                    <button className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/40">
                No orders found matching your filters.
              </p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}