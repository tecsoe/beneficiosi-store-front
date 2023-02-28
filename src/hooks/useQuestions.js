import { useEffect, useState } from 'react';
import useAxios from './useAxios';

const useQuestions = ({ options, axiosConfig } = {}) => {
  const [{ data, error, loading }, getQuestions] = useAxios({ url: '/questions', ...axiosConfig }, options);

  const [questions, setQuestions] = useState([])

  const [total, setTotal] = useState(0);

  const [size, setSize] = useState(0);

  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setQuestions(data.results);
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
    }

  }, [data, loading, error]);

  return [{ questions, total, numberOfPages, size, error, loading }, getQuestions];
};

export default useQuestions;
