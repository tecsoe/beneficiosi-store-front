import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useNotifications = ({ options, axiosConfig } = {}) => {
  const [{ data, error, loading }, getNotifications] = useAxios({ url: '/notifications', ...axiosConfig }, options);

  const [notifications, setNotifications] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setNotifications(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ notifications, total, numberOfPages, size, error, loading }, getNotifications];
};

export default useNotifications;
