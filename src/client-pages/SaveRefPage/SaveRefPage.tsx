import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SaveRefPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem('ref', params.ref || '');
    navigate('/' + params.venue);
  }, [navigate, params.ref, params.venue]);

  return <div></div>;
};

export default SaveRefPage;
