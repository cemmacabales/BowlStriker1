import React, { useEffect, useState, createContext, useContext } from 'react';
export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}
export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}
const INITIAL_ORDERS: Order[] = [
{
  id: 'ORD-7782-X',
  date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  customerName: 'Alex Striker',
  customerEmail: 'alex@example.com',
  items: [
  {
    productId: '1',
    name: 'Cyber Strike X1',
    quantity: 1,
    price: 129.99
  }],

  total: 129.99,
  status: 'processing'
},
{
  id: 'ORD-9921-Z',
  date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  customerName: 'Sarah Lane',
  customerEmail: 'sarah@example.com',
  items: [
  {
    productId: '2',
    name: 'Neon Glide 2077',
    quantity: 2,
    price: 89.99
  }],

  total: 179.98,
  status: 'shipped'
},
{
  id: 'ORD-3321-A',
  date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  customerName: 'Mike Pin',
  customerEmail: 'mike@example.com',
  items: [
  {
    productId: '3',
    name: 'Quantum Core Z',
    quantity: 1,
    price: 159.99
  },
  {
    productId: '6',
    name: 'Retro Future 88',
    quantity: 1,
    price: 79.99
  }],

  total: 239.98,
  status: 'delivered'
},
{
  id: 'ORD-1122-B',
  date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  customerName: 'Jessica Split',
  customerEmail: 'jess@example.com',
  items: [
  {
    productId: '4',
    name: 'Void Runner Pro',
    quantity: 1,
    price: 199.99
  }],

  total: 199.99,
  status: 'delivered'
},
{
  id: 'ORD-5544-C',
  date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  customerName: 'Tom Gutter',
  customerEmail: 'tom@example.com',
  items: [
  {
    productId: '5',
    name: 'Plasma Storm',
    quantity: 1,
    price: 145.0
  }],

  total: 145.0,
  status: 'delivered'
}];

interface OrderContextType {
  orders: Order[];
  updateOrderStatus: (id: string, status: Order['status']) => void;
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  stats: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    recentOrders: Order[];
  };
}
const OrderContext = createContext<OrderContextType | undefined>(undefined);
export function OrderProvider({ children }: {children: React.ReactNode;}) {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    const savedOrders = localStorage.getItem('bowl-striker-orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        setOrders(INITIAL_ORDERS);
      }
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem(
        'bowl-striker-orders',
        JSON.stringify(INITIAL_ORDERS)
      );
    }
  }, []);
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('bowl-striker-orders', JSON.stringify(orders));
    }
  }, [orders]);
  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) =>
    prev.map((o) =>
    o.id === id ?
    {
      ...o,
      status
    } :
    o
    )
    );
  };
  const addOrder = (orderData: Omit<Order, 'id' | 'date'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(Math.random() * 10000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      date: new Date().toISOString()
    };
    setOrders((prev) => [newOrder, ...prev]);
  };
  const stats = {
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: orders.length,
    averageOrderValue:
    orders.length > 0 ?
    orders.reduce((sum, order) => sum + order.total, 0) / orders.length :
    0,
    recentOrders: [...orders].
    sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).
    slice(0, 5)
  };
  return (
    <OrderContext.Provider
      value={{
        orders,
        updateOrderStatus,
        addOrder,
        stats
      }}>

      {children}
    </OrderContext.Provider>);

}
export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within a OrderProvider');
  }
  return context;
}