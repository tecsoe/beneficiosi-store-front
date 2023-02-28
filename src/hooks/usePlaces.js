import { useEffect, useState } from 'react';
import useAxios from './useAxios';


const usePlaces = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getPlaces] = useAxios({ url: '/places', ...axiosConfig }, { useCache: false, ...options });

  const [places, setPlaces] = useState([]);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setPlaces(data.results);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
      setTotal(data.total);
    }
  }, [data]);

  return [{ places, error, loading, total, size, numberOfPages }, getPlaces];
};

export default usePlaces;
