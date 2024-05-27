import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const IsReferal = () => {
  const { referalcode } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!localStorage.getItem('referalcode')) {
      localStorage.setItem('referalcode', referalcode);
    } else {
      navigate('/signup');
    }
  }, [referalcode, navigate]);

  return <></>;
};

export default IsReferal;
