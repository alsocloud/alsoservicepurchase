import ApiSecured from './ApiSecured';

export default class FieldsForService {
  constructor(service, parentAccountId) {
    this.service = service;
    this.parentAccountId = parentAccountId;
  }

  getFields() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      this.begin();
      
      console.log('FieldsForService.getFields', `Getting fields for service ${this.service.ProductName}.`);
    });
  }

  begin() {
    const apiSecured = new ApiSecured(
        '/GetFieldsForService', 
        JSON.stringify({
        "parentAccountId": this.parentAccountId,
        "productName": this.service.ProductName,
        "secondaryParentId": this.service.secondaryParentId ? this.service.secondaryParentId : null,
      })
    );

    const apiSecuredPromise = apiSecured.makeRequest();

    apiSecuredPromise.then((json) => {
      this.resolve(json.Fields);
    }).catch(() => {
      this.reject(Error(`Could not get fields of ${this.service.ProductName} service from server.`));
    });
  }
}