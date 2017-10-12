import Api from './Api';
import Store from './Store';
import { serverBaseUrl } from '../constants/urls';
import { strings } from '../constants/strings';

export default class ApiSecured extends Api {
  constructor(path, requestBodyJsonString) {
    super(path, requestBodyJsonString);
  }

  begin() {
    const store = new Store();

    const storePromise = store.getItem(strings.token);

    storePromise.then((token) => {
      this.doIfGetTokenSuccess(token);
    }).catch((error) => {
      this.doOnError(error, 'Token not found, make sure you are logged in.');
    });
  }

  doIfGetTokenSuccess(token) {
    const promise = this.sendRequestToServer(token, this.path, this.requestBodyJsonString);

    promise.then((response) => {
      this.doOnSendRequestSuccess(response);
    }).catch((error) => {
      this.doOnError(error, 'Problem sending request to server, make sure you are connected to the internet.');
    });
  }

  sendRequestToServer(token, path, requestBodyJsonString) {
    const url = serverBaseUrl + path;

    return fetch(url, {
      method: 'POST',

      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authenticate': `CCPSessionId ${token}`,
      },

      body: requestBodyJsonString
    });
  }
}