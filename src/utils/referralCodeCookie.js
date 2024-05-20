export const getReferralCodeCookie = (document) => {
    return document.cookie
        .split('; ')
        .find((row) => row.startsWith('referralCode='))
        ?.split('=')[1];
}