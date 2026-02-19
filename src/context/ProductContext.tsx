import React, { useEffect, useState, createContext, useContext } from 'react';
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews?: number;
  specs?: Record<string, string>;
}
// Initial mock data from Catalog.tsx
const INITIAL_PRODUCTS: Product[] = [
{
  id: '1',
  name: 'Cyber Strike X1',
  price: 129.99,
  image:
  'https://images.unsplash.com/photo-1610050730990-25e9c0b02000?auto=format&fit=crop&q=80&w=600',
  category: 'Performance',
  description:
  'Professional grade reactive resin ball designed for heavy oil conditions.',
  rating: 4.9,
  reviews: 128,
  specs: {
    Coverstock: 'Reactive Resin Pearl',
    Core: 'Asymmetric AI-X',
    Finish: '1500 Grit Polished',
    'Flare Potential': 'High (6"+)',
    RG: '2.48',
    Diff: '0.054'
  }
},
{
  id: '2',
  name: 'Neon Glide 2077',
  price: 89.99,
  image:
  'https://images.unsplash.com/photo-1599827464871-9685379b1933?auto=format&fit=crop&q=80&w=600',
  category: 'Spare',
  description:
  'Precision polyester spare ball with futuristic neon core technology.',
  rating: 4.7,
  reviews: 85,
  specs: {
    Coverstock: 'Polyester',
    Core: 'Pancake',
    Finish: 'High Polish'
  }
},
{
  id: '3',
  name: 'Quantum Core Z',
  price: 159.99,
  image:
  'https://images.unsplash.com/photo-1622646736932-351ce7e605c6?auto=format&fit=crop&q=80&w=600',
  category: 'Hybrid',
  description:
  'Advanced hybrid coverstock for versatile performance on any lane.',
  rating: 4.8,
  reviews: 210,
  specs: {
    Coverstock: 'Hybrid Reactive',
    Core: 'Symmetric Z-Core',
    Finish: '3000 Grit'
  }
},
{
  id: '4',
  name: 'Void Runner Pro',
  price: 199.99,
  image:
  'https://images.unsplash.com/photo-1584670697840-7473868e0569?auto=format&fit=crop&q=80&w=600',
  category: 'Performance',
  description: 'Black hole inspired core design for maximum pin carry.',
  rating: 5.0,
  reviews: 42,
  specs: {
    Coverstock: 'Solid Reactive',
    Core: 'Void Asymmetric',
    Finish: '2000 Grit'
  }
},
{
  id: '5',
  name: 'Plasma Storm',
  price: 145.0,
  image:
  'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=600',
  category: 'Hybrid',
  description: 'Electrifying performance with controlled aggression.',
  rating: 4.6,
  reviews: 95,
  specs: {
    Coverstock: 'Plasma Hybrid',
    Core: 'Storm Core',
    Finish: '1500 Grit'
  }
},
{
  id: '6',
  name: 'Retro Future 88',
  price: 79.99,
  image:
  'https://images.unsplash.com/photo-1525453806616-488b0053bb10?auto=format&fit=crop&q=80&w=600',
  category: 'Spare',
  description: 'Classic style meets modern durability.',
  rating: 4.5,
  reviews: 60,
  specs: {
    Coverstock: 'Urethane',
    Core: 'Classic 3-Piece',
    Finish: 'Polished'
  }
}];

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
}
const ProductContext = createContext<ProductContextType | undefined>(undefined);
export function ProductProvider({ children }: {children: React.ReactNode;}) {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const savedProducts = localStorage.getItem('bowl-striker-products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error('Failed to parse products', e);
        setProducts(INITIAL_PRODUCTS);
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem(
        'bowl-striker-products',
        JSON.stringify(INITIAL_PRODUCTS)
      );
    }
  }, []);
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('bowl-striker-products', JSON.stringify(products));
    }
  }, [products]);
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString() // Simple ID generation
    };
    setProducts((prev) => [...prev, newProduct]);
  };
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
    prev.map((p) =>
    p.id === id ?
    {
      ...p,
      ...updates
    } :
    p
    )
    );
  };
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };
  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };
  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById
      }}>

      {children}
    </ProductContext.Provider>);

}
export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}