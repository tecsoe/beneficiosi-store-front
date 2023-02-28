import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useCardsIssuers = ({ options, axiosConfig } = {}) => {

  const [{ data, error, loading }, getCardsIssuers] = useAxios({ url: '/card-issuers', ...axiosConfig }, options);

  const [cardsIssuers, setCardsIssuers] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setCardsIssuers(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ cardsIssuers, total, numberOfPages, size, error, loading }, getCardsIssuers];
};

export default useCardsIssuers;
