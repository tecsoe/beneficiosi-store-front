import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const usePayMethods = ({ options, axiosConfig } = {}) => {
  const [{ data, error, loading }, getPayMethods] = useAxios({ url: '/payment-methods', ...axiosConfig }, options);

  const [payMethods, setPayMethods] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setPayMethods(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ payMethods, total, numberOfPages, size, error, loading }, getPayMethods];
};

export default usePayMethods;
