import KakaoLogin from "react-kakao-login";
import { cn } from "src/shared/utils/functions";

const KakaoLoginButton = (className) => {
  const token = process.env.REACT_APP_KAKAO_APP_KEY
  console.log("🚀 ~ KakaoLoginButton ~ token:", token)
	return (

    <>
    <KakaoLogin  
      token={token}
      onSuccess={console.log}
      onFail={console.error}
      onLogout={console.info} className={cn("w-full rounded-lg",className )} />

    </>

)
  
  
};

export default KakaoLoginButton;
