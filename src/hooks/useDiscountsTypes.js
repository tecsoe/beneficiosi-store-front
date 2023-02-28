import { useEffect, useState } from 'react';
import useAxios from './useAxios';


const useDiscountsTypes = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getDiscountsTypes] = useAxios({ url: '/discount-types', ...axiosConfig }, { useCache: false, ...options });

  const [discountsTypes, setDiscountsTypes] = useState([]);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setDiscountsTypes(data.results);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
      setTotal(data.total);
    }
  }, [data]);

  return [{ discountsTypes, error, loading, total, size, numberOfPages }, getDiscountsTypes];
};

export default useDiscountsTypes;
