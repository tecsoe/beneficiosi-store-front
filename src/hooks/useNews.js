import { useEffect, useState } from 'react';
import useAxios from './useAxios';


const useNews = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getNews] = useAxios({ url: '/news', ...axiosConfig }, { useCache: false, ...options });

  const [news, setNews] = useState([]);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setNews(data.results);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
      setTotal(data.total);
    }
  }, [data]);

  return [{ news, error, loading, total, size, numberOfPages }, getNews];
};

export default useNews;
