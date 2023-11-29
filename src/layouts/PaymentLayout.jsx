import React from 'react';
import Logo from 'src/assets/images/logo_purple.svg';

export const PaymentLayout = ({ children }) => {
  return (
    <main className="flex flex-col h-screen p-5 sm:p-10">
      <header>
        <div>
          <img src={Logo} alt="logo" className="w-24" />
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center">{children}</div>
      <footer>
        <div className="text-xs">
          <p>서울특별시 서초구 서초대로 396, 16층 (서초동, 강남빌딩)</p>
          <p>전화번호1533-5021 </p>
          <p>유한회사 나오나우, 대표자명: 레이첼일레인페이토빈;</p>
          <p>사업자등록번호 235-88-02373 </p>
          <p>support@naonow.com</p>
        </div>
      </footer>
    </main>
  );
};
