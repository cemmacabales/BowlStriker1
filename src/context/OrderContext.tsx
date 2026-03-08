import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

export interface Order {
  id: string;
  user_id?: string;
  date: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

interface CreateOrderData {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address?: string;
  items: {
    product_id: string;
    name: string;
    quantity: number;
    price: number;
    image_url?: string;
  }[];
  total: number;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  addOrder: (order: CreateOrderData) => Promise<Order>;
  fetchOrders: () => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
  stats: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    recentOrders: Order[];
  };
  clearAllOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch orders with items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            name,
            quantity,
            price,
            image_url
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Also fetch product info for order items
      const mappedOrders: Order[] = (ordersData || []).map((order: any) => ({
        id: order.id,
        user_id: order.user_id,
        date: order.created_at,
        customer_name: order.customer_name || '',
        customer_email: order.customer_email || '',
        customer_phone: order.customer_phone || '',
        shipping_address: order.shipping_address || '',
        total: parseFloat(order.total) || 0,
        status: order.status || 'pending',
        items: (order.order_items || []).map((item: any) => ({
          id: item.id,
          order_id: order.id,
          product_id: item.product_id,
          name: item.name || '',
          quantity: item.quantity,
          price: parseFloat(item.price) || 0,
        })),
      }));

      setOrders(mappedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addOrder = async (orderData: CreateOrderData): Promise<Order> => {
    if (!user) throw new Error('Must be logged in to place an order');

    try {
      // Insert the order
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total: orderData.total,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone || null,
          shipping_address: orderData.shipping_address || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items (include name and image_url for denormalized access)
      const orderItems = orderData.items.map((item) => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image_url: item.image_url || null,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Build the full order object to return
      const fullOrder: Order = {
        id: newOrder.id,
        user_id: newOrder.user_id,
        date: newOrder.created_at,
        customer_name: newOrder.customer_name,
        customer_email: newOrder.customer_email,
        customer_phone: newOrder.customer_phone,
        shipping_address: newOrder.shipping_address,
        total: parseFloat(newOrder.total),
        status: newOrder.status,
        items: orderData.items.map((item) => ({
          product_id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image_url: item.image_url,
        })),
      };

      // Update local state
      setOrders((prev) => [fullOrder, ...prev]);

      // Update product stock
      for (const item of orderData.items) {
        await supabase.rpc('decrement_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        }).then(({ error }) => {
          // Silently fail stock updates - not critical
          if (error) console.warn('Stock update failed for', item.product_id, error);
        });
      }

      return fullOrder;
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      throw err;
    }
  };

  const getOrderById = (id: string): Order | undefined => {
    return orders.find((o) => o.id === id);
  };

  const clearAllOrders = async () => {
    try {
      console.log('Starting to clear all orders');

      // Delete all order items first using a dummy condition
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (itemsError) {
        console.error('Failed to clear order items:', itemsError);
        throw itemsError;
      }
      console.log('Successfully cleared order items');

      // Delete all orders using a dummy condition
      const { error: ordersError } = await supabase
        .from('orders')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (ordersError) {
        console.error('Failed to clear orders:', ordersError);
        throw ordersError;
      }

      console.log('Successfully cleared all orders');
      setOrders([]);
    } catch (err: any) {
      console.error('Error clearing orders stack:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Subscribe to real-time changes on orders
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchOrders]);

  const stats = {
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: orders.length,
    averageOrderValue:
      orders.length > 0
        ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length
        : 0,
    recentOrders: [...orders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5),
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        updateOrderStatus,
        addOrder,
        fetchOrders,
        getOrderById,
        stats,
        clearAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}