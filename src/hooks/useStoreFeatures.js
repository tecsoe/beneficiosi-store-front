import { useEffect, useState } from 'react';
import useAxios from './useAxios';


const useStoreFeatures = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getStoreFeatures] = useAxios({ url: '/store-features', ...axiosConfig }, { useCache: false, ...options });

  const [storeFeatures, setStoreFeatures] = useState([]);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setStoreFeatures(data.results);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
      setTotal(data.total);
    }
  }, [data]);

  return [{ storeFeatures, error, loading, total, size, numberOfPages }, getStoreFeatures];
};

export default useStoreFeatures;
