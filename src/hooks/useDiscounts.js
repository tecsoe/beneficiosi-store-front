import { useEffect, useState } from 'react';
import useAxios from './useAxios';


const useDiscounts = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getDiscounts] = useAxios({ url: '/discounts', ...axiosConfig }, { useCache: false, ...options });

  const [discounts, setDiscounts] = useState([]);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setDiscounts(data.results);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
      setTotal(data.total);
    }
  }, [data]);

  return [{ discounts, error, loading, total, size, numberOfPages }, getDiscounts];
};

export default useDiscounts;
