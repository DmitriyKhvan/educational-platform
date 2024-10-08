export const parseErrorMessage = (error: Error) => {
  try {
    const errorData = JSON.parse(error.message);
    if (typeof errorData !== 'object') {
      throw new Error();
    }

    return errorData;
  } catch (_e) {
    return false;
  }
};
