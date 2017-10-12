import ApiSecured from './ApiSecured';

export default class Session {
  isValid() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      this.beginValidation();

      console.log('Session.isValid', 'Session validity check has begun.');
    });
  }

  beginValidation() {
    const apiSecured = new ApiSecured('/PingPong', JSON.stringify({}));

    const apiSecuredPromise = apiSecured.makeRequest();

    apiSecuredPromise.then(() => {
      this.resolve();
    }).catch(() => {
      this.reject(Error('Session is not active.'));
    });
  }
}