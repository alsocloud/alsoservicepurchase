import Store from './Store';
import Api from './Api';
import { isEmptyString } from '../helpers';
import { strings } from '../constants/strings';

export default class Auth {
  constructor(fields) {
    this.fields = fields;
  }

  requestAuth() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      this.beginProcess();

      console.log('Auth.requestAuth', 'Authorization intialized.');
    });
  }

  beginProcess() {
    const api = new Api('/GetSessionToken', JSON.stringify({ username: this.fields.email, password: this.fields.password, }));

    const apiPromise = api.makeRequest();

    apiPromise.then((token) => {
      this.doOnReceiveToken(token);
    })
    .catch((error) => {
      this.doIfAuthError(error);
    });
  }

  doOnReceiveToken(token) {
    if (!isEmptyString(token)) {
      this.doIfTokenIsNotEmpty(token);
    } else {
      this.reject(Error('Server returned empty token. Contact administrator.'));
    }
  }

  doIfTokenIsNotEmpty(token) {
    const store = new Store();

    const storePromise = store.setItem(strings.token, token);

    storePromise.then(() => {
      this.resolve(token);
    }).catch((error) => {
      this.doIfAuthError(error);
    });
  }

  doIfAuthError(error) {
    console.error('Auth.doIfAuthError', error);

    if (error.message === strings.errorReturnedFromServer)
      this.reject(Error('Problem signing in, try later or contact admin.'));
    else
      this.reject(error);
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      this.beginLogout();

      console.log('Auth.logout', 'Logout has begun.');
    });
  }

  beginLogout() {
    const store = new Store();

    const storePromise = store.removeItem(strings.token);

    storePromise.then(() => {
      this.resolve();
    }).catch((error) => {
      console.error(error);
      this.reject(Error('Could not log out.'));
    })
  }
}