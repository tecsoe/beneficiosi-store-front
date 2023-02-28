import { useEffect, useState } from 'react';
import useAxios from './useAxios';


const useCategoriesStores = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getCategoriesStores] = useAxios({ url: '/stores/categories', ...axiosConfig }, { useCache: false, ...options });

  const [categoriesStores, setCategoriesStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
      setCategoriesStores(data.results);
    }
  }, [data]);

  return [{ categoriesStores, error, loading, total, size, numberOfPages }, getCategoriesStores];
};

export default useCategoriesStores;
