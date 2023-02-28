import { useEffect, useState } from 'react';
import useAxios from './useAxios';


const useHours = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getHours] = useAxios({ url: '/store-hours', ...axiosConfig }, { useCache: false, ...options });

  const [hours, setHours] = useState([]);

  useEffect(() => {
    if (data) {
      setHours(data.results);
    }
  }, [data]);

  return [{ hours, error, loading }, getHours];
};

export default useHours;
