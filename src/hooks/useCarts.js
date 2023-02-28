import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useCarts = ({ options, axiosConfig } = {}) => {
  const [{ data, error, loading }, getCarts] = useAxios({ url: '/carts', ...axiosConfig }, options);

  const [carts, setCarts] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setCarts(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ carts, total, numberOfPages, size, error, loading }, getCarts];
};

export default useCarts;
