export const getReferralCodeCookie = (document) => {
    return document.cookie
        .split('; ')
        .find((row) => row.startsWith('referralCode='))
        ?.split('=')[1];
}

export const deleteReferralCodeCookie = () => {
    const cookies = document.cookie.split('; ');
    const cookieList = cookies.filter((cookie) => cookie.startsWith('referralCode'));
    cookieList.forEach((cookie) => {
      document.cookie = cookie
        .split('=')[0] + '=;expires=' + new Date(0).toUTCString();
    });
}