import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  attributes: {
    title: string;
    category: string;
    company: string;
    price: number;
    image: string;
    shipping: boolean;
  };
}

const ProductFilter: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [freeShipping, setFreeShipping] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://strapi-store-server.onrender.com/api/products")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          setProducts(data.data);
          setFilteredProducts(data.data);
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  const handleFilter = () => {
    let filtered = products;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(product =>
        product.attributes.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== '') {
      filtered = filtered.filter(product => product.attributes.category === category);
    }

    if (company !== '') {
      filtered = filtered.filter(product => product.attributes.company === company);
    }

    filtered = filtered.filter(
      product => product.attributes.price >= minPrice && product.attributes.price <= maxPrice
    );

    if (freeShipping) {
      filtered = filtered.filter(product => product.attributes.shipping);
    }

    if (sortBy === 'a-z') {
      filtered = filtered.sort((a, b) => a.attributes.title.localeCompare(b.attributes.title));
    } else if (sortBy === 'z-a') {
      filtered = filtered.sort((a, b) => b.attributes.title.localeCompare(a.attributes.title));
    }

    setFilteredProducts(filtered);
    setIsFiltered(true);
  };

  const handleReset = () => {
    setSearchTerm('');
    setCategory('');
    setCompany('');
    setSortBy('');
    setFreeShipping(false);
    setMinPrice(0);
    setMaxPrice(100000);
    setIsFiltered(false);
    setFilteredProducts(products);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(Number(e.target.value));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(Number(e.target.value));
  };

  const categories = Array.from(new Set(products.map(product => product.attributes.category)));
  const companies = Array.from(new Set(products.map(product => product.attributes.company)));

  if (loading) {
    return <div>Loading...</div>;
