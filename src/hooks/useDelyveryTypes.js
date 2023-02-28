import { useEffect, useState } from 'react';
import useAxios from './useAxios';


const useDeliveryTypes = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getDeliveryTypes] = useAxios({ url: '/delivery-method-types', ...axiosConfig }, { useCache: false, ...options });

  const [deliveryTypes, setDeliveryTypes] = useState([]);

  useEffect(() => {
    if (data) {
      setDeliveryTypes(data.results);
    }
  }, [data]);

  return [{ deliveryTypes, error, loading }, getDeliveryTypes];
};

export default useDeliveryTypes;
