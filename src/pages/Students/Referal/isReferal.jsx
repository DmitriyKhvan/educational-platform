import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { FaCircleXmark } from 'react-icons/fa6';
import { useHistory, useParams } from 'react-router-dom';
import { VALIDATE_REFERRAL_CODE } from 'src/modules/graphql/mutations/referralCodes';

const IsReferal = () => {
  const { referralcode } = useParams();
  const history = useHistory();
  const [ error, setError ] = useState(false);
  localStorage.removeItem('referalcode');
  useQuery(VALIDATE_REFERRAL_CODE, { variables: { referralCode: referralcode }, fetchPolicy: 'no-cache',
  onCompleted: (data)=> {
    console.log(data);
    if (data.validateReferralCode.isValid === true) {
      localStorage.setItem('referalcode', referralcode);
      history.push('/trial');
    } else {
      setError(true)
    }
  } });

  return <>
    {error && <div className="max-w-[440px] m-auto space-y-8 flex flex-col items-center">
            <FaCircleXmark className="w-16 h-16 text-red-500" />
            <h1 className="font-bold text-2xl sm:text-3xl text-center">
              Referral Code is Not Valid.
            </h1>
          </div>}</>;
};

export default IsReferal;
