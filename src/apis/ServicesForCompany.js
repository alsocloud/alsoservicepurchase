import ApiSecured from './ApiSecured';

export default class ServicesForCompany {
  constructor(companyAccountId) {
    this.companyAccountId = companyAccountId;
  }

  getServices() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      this.begin();

      console.log('ServicesForCompany.getServices', 'Get services has begun.');
    });
  }

  begin() {
    const apiSecured = new ApiSecured('/GetPossibleServicesForParent', JSON.stringify({ "parentAccountId": this.companyAccountId }));

    const apiSecuredPromise = apiSecured.makeRequest();

    apiSecuredPromise.then((services) => {
      this.doWhenGetServicesSuccess(services);
    }).catch(() => {
      this.reject(Error('Could not get the services of company from server.'));
    });
  }

  doWhenGetServicesSuccess(services) {
    const parsedServices = this.parseServices(services);
    this.resolve(parsedServices);
  }
  
  parseServices(services) {
    return Object.keys(services).map((key) => {
      const service = services[key];
  
      service.key = key;
      service.icon = {
        path: services[key].Icon,
        placeholder: 'http://fakeimg.pl/75/'
      };
      service.price = 0;
  
      return service;
    });
  }
}