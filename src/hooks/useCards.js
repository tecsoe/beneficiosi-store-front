import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useCards = ({ options, axiosConfig } = {}) => {

  const [{ data, error, loading }, getCards] = useAxios({ url: '/cards', ...axiosConfig }, options);

  const [cards, setCards] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setCards(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ cards, total, numberOfPages, size, error, loading }, getCards];
};

export default useCards;
