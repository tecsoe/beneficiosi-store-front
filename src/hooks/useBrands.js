import { useEffect, useState } from 'react';
import useAxios from './useAxios';


const useBrands = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getBrands] = useAxios({ url: '/brands', ...axiosConfig }, { useCache: false, ...options });

  const [brands, setBrands] = useState([]);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
      setBrands(data.results);
    }
  }, [data]);

  return [{ brands, error, loading, total, size, numberOfPages }, getBrands];
};

export default useBrands;
