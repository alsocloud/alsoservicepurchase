import ApiSecured from './ApiSecured';

export default class CreateSubscription {
  constructor(fields, parentAccountId, serviceName) {
    this.fields = fields;
    this.parentAccountId = parentAccountId;
    this.serviceName = serviceName;
  }

  create() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      this.begin();
      
      console.log('CreateSubscription.create', `Creating subscription for service ${this.serviceName}.`);
    });
  }

  begin() {
    const apiSecured = new ApiSecured(
      '/CreateSubscription',
      JSON.stringify({
        "subscriptionAccount": {
          Fields: this.fields,
          ParentAccountId: this.parentAccountId,
          ServiceName: this.serviceName,
        }
      })
    );

    const apiSecuredPromise = apiSecured.makeRequest();

    apiSecuredPromise.then((json) => {
      this.resolve(json);
    }).catch(() => {
      this.reject(Error('Could not create subscription on server.'));
    });
  }
}