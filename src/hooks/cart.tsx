import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      // await AsyncStorage.clear();
      const storagedProducts = await AsyncStorage.getItem(
        '@GoMarketplace:items',
      );
      storagedProducts && setProducts([...JSON.parse(storagedProducts)]);
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      // TODO ADD A NEW ITEM TO THE CART
      // const storage = await AsyncStorage.getItem('@GoMarketplace:items');
      // const cartProducts = storage && JSON.parse(storage);
      // console.log('addToCart=> ', cartProducts);
      const cartProducts = [...products];

      if (cartProducts) {
        const productIndex = cartProducts.findIndex(
          (item: Product) => item.id === product.id,
        );
        if (
          productIndex > -1
          // cartProducts.find((item: Product, index: number) => {
          //   if (item.id === product.id) {
          //     cartProducts[index].quantity += 1;
          //     return true;
          //   }
          //   return false;
          // })
        ) {
          cartProducts[productIndex].quantity += 1;
          await AsyncStorage.setItem(
            '@GoMarketplace:items',
            JSON.stringify(cartProducts),
          );
          setProducts(cartProducts);
          return;
        }
      }

      product.quantity = 1;

      await AsyncStorage.setItem(
        '@GoMarketplace:items',
        JSON.stringify([...products, product]),
      );
      setProducts([...products, product]);
    },
    [products],
  );

  /*
  const addToCart = useCallback(
    async product => {
      const productExists = products.find(p => p.id === product.id);

      if (productExists) {
        setProducts(
          products.map(p =>
            p.id === product.id ? { ...product, quantity: p.quantity + 1 } : p,
          ),
        );
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }
      await AsyncStorage.setItem(
        '@GoMarketplace:items',
        JSON.stringify(products),
      );
    },
    [products],
  );
  */

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART

      // const storage = await AsyncStorage.getItem('@GoMarketplace:items');
      // const cartProducts = storage && JSON.parse(storage);
      const cartProducts = [...products];
      const productIndex = cartProducts.findIndex(
        (item: Product) => item.id === id,
      );

      cartProducts[productIndex].quantity += 1;

      await AsyncStorage.setItem(
        '@GoMarketplace:items',
        JSON.stringify(cartProducts),
      );
      setProducts(cartProducts);

      /*
      const newProducts = products.map(product =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      );
      setProducts(newProducts);
      await AsyncStorage.setItem(
        '@GoMarketplace:items',
        JSON.stringify(newProducts),
      );
      */
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART

      // const storage = await AsyncStorage.getItem('@GoMarketplace:items');
      // const cartProducts = storage && JSON.parse(storage);
      const cartProducts = [...products];
      const productIndex = cartProducts.findIndex(
        (item: Product) => item.id === id,
      );
      cartProducts[productIndex].quantity -= 1;

      // if (cartProducts[productIndex].quantity === 0) {
      //   cartProducts.splice(productIndex, 1);
      // }

      await AsyncStorage.setItem(
        '@GoMarketplace:items',
        JSON.stringify(cartProducts),
      );
      setProducts(cartProducts);

      /*
      const newProducts = products.map(product =>
        product.id === id
          ? { ...product, quantity: product.quantity - 1 }
          : product,
      );
      setProducts(newProducts);
      await AsyncStorage.setItem(
        '@GoMarketplace:items',
        JSON.stringify(newProducts),
      );
      */
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
