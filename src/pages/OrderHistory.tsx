import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ExternalLink } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
export function OrderHistory() {
  const orders = [
  {
    id: 'BS-8829-X',
    date: 'Oct 24, 2023',
    total: 129.99,
    status: 'Delivered',
    items: 2
  },
  {
    id: 'BS-7732-Y',
    date: 'Sep 12, 2023',
    total: 45.5,
    status: 'Delivered',
    items: 1
  },
  {
    id: 'BS-9921-Z',
    date: 'Aug 05, 2023',
    total: 210.0,
    status: 'Delivered',
    items: 3
  }];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold">Order History</h1>
          <Link to="/catalog" className="text-primary-cyan hover:underline">
            Start new order
          </Link>
        </div>

        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 font-medium text-white/70">Order ID</th>
                  <th className="p-4 font-medium text-white/70">Date</th>
                  <th className="p-4 font-medium text-white/70">Items</th>
                  <th className="p-4 font-medium text-white/70">Total</th>
                  <th className="p-4 font-medium text-white/70">Status</th>
                  <th className="p-4 font-medium text-white/70">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) =>
                <tr
                  key={order.id}
                  className="hover:bg-white/5 transition-colors">

                    <td className="p-4 font-mono text-primary-cyan">
                      #{order.id}
                    </td>
                    <td className="p-4 text-white/80">{order.date}</td>
                    <td className="p-4 text-white/80">{order.items} items</td>
                    <td className="p-4 font-bold">${order.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-white/50 hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>);

}