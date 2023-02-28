import { useEffect, useState } from 'react';
import useAxios from './useAxios';


const useTags = ({ options, ...axiosConfig } = {}) => {

  const [{ data, error, loading }, getTags] = useAxios({ url: '/tags', ...axiosConfig }, { useCache: false, ...options });

  const [tags, setTags] = useState([]);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  useEffect(() => {
    if (data) {
      setTotal(data.total);
      setSize(data.size);
      setNumberOfPages(data.numberOfPages);
      setTags(data.results);
    }
  }, [data]);

  return [{ tags, error, loading, total, size, numberOfPages }, getTags];
};

export default useTags;
