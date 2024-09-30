import KakaoLogin from 'react-kakao-login';
import { cn } from '@/shared/utils/functions';

const KakaoLoginButton = (className: string) => {
  const token = process.env.REACT_APP_KAKAO_APP_KEY;
  return (
    <>
      {token && (
        <KakaoLogin
          token={token}
          onSuccess={console.log}
          onFail={console.error}
          onLogout={console.info}
          className={cn('w-full rounded-lg', className)}
        />
      )}
    </>
  );
};

export default KakaoLoginButton;
