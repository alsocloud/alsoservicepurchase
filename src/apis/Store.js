import { AsyncStorage } from 'react-native';

export default class Store {
  setItem(key, value) {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      this.beginSetItem(key, value);
    });
  }

  beginSetItem(key, value) {
    const setPromise = AsyncStorage.setItem(key, value);

    setPromise.then(() => {
      this.resolve();
    }).catch((error) => {
      console.error(error);
      this.reject(Error('Problem setting item - ensure sure key and value are set.'));
    });
  }

  getItem(key) {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      this.beginGetItem(key);
    });
  }

  beginGetItem(key) {
    const getPromise = AsyncStorage.getItem(key);

    getPromise.then((value) => {
      if (value !== null){
        this.resolve(value);
      } else {
        this.reject(Error('Item does not exist.'));
      }
    }).catch((error) => {
      console.error(error);
      this.reject(Error('Problem getting item - ensure sure key is set.'));
    });
  }

  removeItem(key) {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      this.beginRemoveItem(key);
    });
  }

  beginRemoveItem(key) {
    const removePromise = AsyncStorage.removeItem(key);

    removePromise.then(() => {
      this.resolve();
    }).catch((error) => {
      console.error(error);
      this.reject(Error('Problem removing item - ensure sure key is set.'));
    });
  }
}