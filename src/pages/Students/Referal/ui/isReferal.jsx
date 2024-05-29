import { useQuery } from '@apollo/client';
import { IoIosWarning } from 'react-icons/io';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import Loader from 'src/components/Loader/Loader';
import { VALIDATE_REFERRAL_CODE } from 'src/shared/apollo/mutations/referralCodes';

const IsReferal = () => {
  const { referralcode } = useParams();
  const [searchParams] = useSearchParams();

  const { data, loading } = useQuery(VALIDATE_REFERRAL_CODE, {
    variables: { referralCode: referralcode },
    fetchPolicy: 'no-cache',
  });

  if (loading) return <Loader height="100%" />;

  if (data?.validateReferralCode?.isValid) {
    localStorage.setItem('referralCode', referralcode);
    localStorage.setItem('referralEmail', searchParams.get('email'));
    return <Navigate to="/trial" />;
  } else {
    return (
      <div className="flex w-full h-full">
        <div className="max-w-[400px] m-auto flex flex-col items-center">
          <div className="p-3 rounded-lg bg-[rgba(234,_33,_33,_0.10)]">
            <IoIosWarning className="text-2xl text-[#EA2121]" />
          </div>
          <h2 className="text-[clamp(1rem,8vw,2rem)] sm:text-[38px] font-bold leading-8 mt-8">
            Not valid referral link
          </h2>
          <p className="text-center mt-4">
            Please check if the referral link is correct and try again
          </p>
        </div>
      </div>
    );
  }
};

export default IsReferal;
