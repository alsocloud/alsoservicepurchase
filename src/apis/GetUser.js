import Store from './Store';
import ApiSecured from './ApiSecured';
import { strings } from '../constants/strings';

export default class GetUser {
  begin() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      this.beginGetUser();

      console.log('GetUser.get', 'Get user process has begun.');
    });
  }

  beginGetUser() {
    const apiSecured = new ApiSecured('/GetUser', JSON.stringify({}));

    const apiSecuredPromise = apiSecured.makeRequest();

    apiSecuredPromise.then((user) => {
      this.doIfGetUserSuccess(user);
    }).catch(() => {
      this.reject(Error('Could not get user from server.'));
    });
  }

  doIfGetUserSuccess(user) {
    if (user) {
      this.saveUserToStore(user);
    } else {
      this.doIfNullUser();
    }
  }

  saveUserToStore(user) {
    const store = new Store();

    const storePromise = store.setItem(strings.user, JSON.stringify(user));

    storePromise.then(() => {
      this.resolve();
    }).catch((error) => {
      this.doIfStorePromiseSetUserFailure(error);
    });
  }

  doIfStorePromiseSetUserFailure(error) {
    console.error('User.doIfStorePromiseSetUserFailure', error);

    this.reject(Error('Problem saving the user, please contact app creator.'));
  }

  doIfNullUser() {
    console.error('GetUser.doIfNullUser', 'Server returned null user.');

    this.reject(Error('Could not get user details from server.'));
  }
}