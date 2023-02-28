import { useEffect, useState } from 'react';
import useAxios from './useAxios';


const useCountries = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getCountries] = useAxios({ url: '/countries', ...axiosConfig }, { useCache: false, ...options });

  const [countries, setCountries] = useState([]);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setCountries(data.results);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
      setTotal(data.total);
    }
  }, [data]);

  return [{ countries, error, loading, total, size, numberOfPages }, getCountries];
};

export default useCountries;
