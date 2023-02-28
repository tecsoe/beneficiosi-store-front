import { useEffect, useState } from 'react';
import useAxios from './useAxios';


const useDeliveryNotes = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getDeliveryNotes] = useAxios({ url: '/delivery-notes', ...axiosConfig }, { useCache: false, ...options });

  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setDeliveryNotes(data.results);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
      setTotal(data.total);
    }
  }, [data]);

  return [{ deliveryNotes, error, loading, total, size, numberOfPages }, getDeliveryNotes];
};

export default useDeliveryNotes;
