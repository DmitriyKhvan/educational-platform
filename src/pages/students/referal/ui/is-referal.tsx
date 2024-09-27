import Loader from '@/components/loader/loader';
import ReferalLanding from '@/pages/students/referal/ui/referal-landing';
import { VALIDATE_REFERRAL_CODE } from '@/shared/apollo/mutations/referral-codes';
import { useQuery } from '@apollo/client';
import { IoIosWarning } from 'react-icons/io';
import { useParams } from 'react-router-dom';

const IsReferal = () => {
  const { referralcode } = useParams();

  const { data, loading } = useQuery(VALIDATE_REFERRAL_CODE, {
    variables: { referralCode: referralcode },
    fetchPolicy: 'no-cache',
  });

  if (loading) return <Loader height="100vh" />;

  if (data?.validateReferralCode?.isValid) {
    localStorage.setItem('referralCode', referralcode ?? '');
    return <ReferalLanding student={data?.validateReferralCode?.student} />;
  }
  return (
    <div className="flex w-full h-screen">
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
};

export default IsReferal;
