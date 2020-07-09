export const setToLocalStorage = (keyName, keyData) => {
  localStorage.setItem(keyName, JSON.stringify(keyData));
};

export const getFromLocalStorage = (keyName) => {
  if (localStorage.getItem(keyName)) {
    const storageData = JSON.parse(localStorage.getItem('user'));
    return storageData;
  }
  return null;
};

export const removeFromLocalStorage = (keyName) => {
  if (localStorage.getItem(keyName)) {
    localStorage.removeItem(keyName);
  }
};
