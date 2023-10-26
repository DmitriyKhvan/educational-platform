const previousURL = () => {
  const previousURL = document.referrer; // Преобразуем предыдущий URL
  let path = null;
  if (previousURL) {
    const urlObject = new URL(previousURL); // Преобразуем его в объект URL
    path = urlObject.pathname; // Получаем путь без домена
  }

  return path;
};

export default previousURL;
