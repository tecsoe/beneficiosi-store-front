import { useEffect, useState } from 'react';
import useAxios from './useAxios';


const useProducts = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getProducts] = useAxios({ url: '/products', ...axiosConfig }, { useCache: false, ...options });

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setProducts(data.results);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
      setTotal(data.total);
    }
  }, [data]);

  return [{ products, error, loading, total, size, numberOfPages }, getProducts];
};

export default useProducts;
