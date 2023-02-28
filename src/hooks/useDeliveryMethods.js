import { useEffect, useState } from 'react';
import useAxios from './useAxios';


const useDeliveryMethods = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getDeliveryMethods] = useAxios({ url: '/delivery-methods', ...axiosConfig }, { useCache: false, ...options });

  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setDeliveryMethods(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }
  }, [data]);

  return [{ deliveryMethods, total, size, numberOfPages, error, loading }, getDeliveryMethods];
};

export default useDeliveryMethods;
