import Store from './Store';
import { serverBaseUrl } from '../constants/urls';
import { strings } from '../constants/strings';

export default class Api {
  constructor(path, requestBodyJsonString) {
    this.path = path;
    this.requestBodyJsonString = requestBodyJsonString;
  }

  makeRequest() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      this.begin();
      
      console.log('Api.makeRequest', `began request for path ${this.path}.`);
    });
  }

  begin() {
    const promise = this.sendRequestToServer(this.path, this.requestBodyJsonString);

    promise.then((response) => {
      this.doOnSendRequestSuccess(response);
    }).catch((error) => {
      this.doOnError(error, strings.problemSendingToServer);
    });
  }

  sendRequestToServer(path, requestBodyJsonString) {
    const url = serverBaseUrl + path;

    return fetch(url, {
      method: 'POST',

      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },

      body: requestBodyJsonString
    });
  }

  doOnSendRequestSuccess(response) {
    if (response.status === 200) {
      this.doIfStatusOk(response._bodyInit);
    } else {
      this.doIfStatusNotOk(response._bodyInit);
    }
  }

  doIfStatusOk(jsonString) {
    const json = JSON.parse(jsonString);
    this.resolve(json);
  }

  doIfStatusNotOk(xmlString) {
    this.doOnError(xmlString, strings.errorReturnedFromServer);
  }

  doOnError(error, message) {
    console.error('Api.doOnError', error);
    this.reject(Error(message));
  }
}