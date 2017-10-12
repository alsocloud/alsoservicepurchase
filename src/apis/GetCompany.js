import Store from './Store';
import ApiSecured from './ApiSecured';
import { strings } from '../constants/strings';

export default class GetCompany {
  begin() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      this.beginGetCompany();

      console.log('GetCompany.begin', 'Get company details has begun.');
    });
  }

  beginGetCompany() {
    const apiSecured = new ApiSecured('/GetCompany', JSON.stringify({}));

    const apiSecuredPromise = apiSecured.makeRequest();

    apiSecuredPromise.then((company) => {
      this.doIfGetCompanySuccess(company);
    }).catch(() => {
      this.reject(Error('Could not get company from server.'));
    });
  }

  doIfGetCompanySuccess(company) {
    const store = new Store();

    const storePromise = store.setItem(strings.company, JSON.stringify(company));

    storePromise.then(() => {
      this.resolve(company);
    }).catch((error) => {
      this.doOnError(error);
    });
  }

  doOnError(error) {
    console.error('GetCompany.doOnError', error);

    this.reject(Error('Company could not be saved.'));
  }
}