import React, { Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import GetCompany from '../apis/GetCompany';
import ServicesForCompany from '../apis/ServicesForCompany';
import Store from '../apis/Store';
import Auth from '../apis/Auth';
import { strings } from '../constants/strings';
import Toolbar from '../components/Toolbar';
import SecondaryToolbar from '../components/SecondaryToolbar';
import Logout from '../components/Logout';
import ServiceItem from '../components/ServiceItem';
import Dialog from '../components/Dialog';

export default class AvailableServicesScreen extends Component {
  static navigationOptions = {
    header: <Toolbar/>,
  };

  constructor(props) {
    super(props);

    this.state = {
      user: {
        FirstName: '',
        LastName: '',
      },
      company: {},
      loadingServices: false,
      services: [],
      selectedService: {},
      dependentService: {},
      dialog: {
        visible: false,
        width: null,
        headerText: null,
        body: null,
        negativeButtonText: null,
        positiveButtonText: null,
        onNegativeButtonPressed: null,
        onPositiveButtonPressed: null,
      },
      loggingOut: false,
    };
  }
  
  render() {
    const {user, loadingServices, services, loggingOut } = this.state;

    return (
      <View style={styles.container}>
        <SecondaryToolbar
          primaryButton={<MaterialCommunityIcons name="account" size={25} color="#fff"/>}
          title={`${user.FirstName} ${user.LastName}`}
          secondaryButton={<Logout onLogout={this.handleLogout} />}
        />

        <View style={styles.content}>
          { loadingServices ? this.renderLoading() : null }

          { services.length > 0 ? this.renderServices() : null }
        </View>

        <Spinner visible={loggingOut} />
      </View>
    );
  }

  renderLoading = () => {
    return (
      <View style={styles.loading}>
        <ActivityIndicator/>
      </View>
    );
  }

  renderServices = () => {
    const { services, dialog } = this.state;

    return (
      <View style={styles.listContainer}>
        <FlatList
          data={services}
          renderItem={({item}) => {;
            return (
              <ServiceItem service={item} onAddService={this.handleAddService} />
            );
          }}
        />
        
        <Dialog
          visible={dialog.visible}
          width={dialog.width}
          headerText={dialog.headerText}
          body={dialog.body}
          negativeButtonText={dialog.negativeButtonText}
          positiveButtonText={dialog.positiveButtonText}
          onNegativeButtonPressed={dialog.onNegativeButtonPressed}
          onPositiveButtonPressed={dialog.onPositiveButtonPressed}
        />
      </View>
    );
  };

  handleAddService = (service) => {
    if (service.DependencyInfo.length > 0) {
      this.doIfDependency(service);
    } else {
      this.selectService(service);
    }
  };

  doIfDependency = (service) => {
    for (var depInfo of service.DependencyInfo) {
      if (!depInfo.DependentProductAdded) {
        this.selectNeededDependency(service, depInfo);
        break;
      }
    }
  };

  selectNeededDependency = (service, depInfo) => {
    const dependentService = this.getDependentServiceDetails(depInfo.ProductName);

    this.setState({ dependentService }, this.showNeededDependencyDialog(service, dependentService));
  };

  showNeededDependencyDialog = (service, dependentService) => {
    const dialog = {};
    
    dialog.visible = true;
    dialog.headerText =`${service.DisplayName} ${strings.dependentServiceDialogHeaderTextEnd}`;
    dialog.body = <ServiceItem service={dependentService} onAddService={this.handleAddDependentService} />;
    dialog.negativeButtonText = strings.cancel.toUpperCase();
    dialog.onNegativeButtonPressed = this.closeDialog;

    this.setState({ dialog });
  };

  getDependentServiceDetails = (serviceProductName) => {
    const { services } = this.state;

    const dependentService = services.find((service) => {
      return service.ProductName === serviceProductName;
    });

    return dependentService;
  }

  handleAddDependentService = () => {
    const { dependentService } = this.state;

    this.selectService(dependentService);
  };
  
  selectService = (service) => {
    this.setState({ selectedService: service }, this.showTerms(service.DisplayName));
  };

  showTerms = (serviceDisplayName) => {
    const dialog = {};
    
    dialog.visible = true;
    dialog.width = 300;
    dialog.headerText = strings.termsAlertTitle;
    dialog.body = strings.termsAlertBodyStart + ` "${serviceDisplayName}" ` + strings.termsAlertBodyEnd;
    dialog.negativeButtonText = strings.disagree;
    dialog.onNegativeButtonPressed = this.closeDialog;
    dialog.positiveButtonText = strings.agree;
    dialog.onPositiveButtonPressed = this.handleAgree;

    this.setState({ dialog });
  };

  handleAgree = () => {
    const { selectedService, company } = this.state;
    const { navigate } = this.props.navigation;

    this.closeDialog();
    
    navigate(
      'Configuration',
      {
        service: selectedService,
        parentAccountId: company.AccountId,
        onPurchaseComplete: this.handlePurchaseComplete 
      }
    );
  };

  closeDialog = () => {
    const { dialog } = this.state;

    dialog.visible = false;
    
    this.setState({ dialog });
  };

  handlePurchaseComplete = (data) => {
    console.log('AvailableServicesScreen.handlePurchaseComplete', data);
    Toast.show(strings.servicePurchaseSuccessful, Toast.LONG);
    // TODO: use purchased data somewhere else in the UI.
  };

  handleLogout = () => {
    this.setState({ loggingOut: true });

    this.stopLoadingServices();

    this.doLogout();
  };

  stopLoadingServices = () => {
    const { loadingServices } = this.state;
    if (loadingServices) {
      this.setState({loadingServices: false});
      // TODO: Stop request for services made to server.
    }
  };

  // TODO: Move to logout component
  doLogout = () => {
    const auth = new Auth();

    const authPromise = auth.logout();

    authPromise.then(() => {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Login'})
        ]
      });

      this.props.navigation.dispatch(resetAction);
    }).catch((error) => {
      this.setState({ loggingOut: false });
      Toast.show(error.message, Toast.LONG);
    })
  }

  componentDidMount() {
    this.getUser();
    this.setState({ loadingServices: true }, this.loadServices());
  }

  getUser = () => {
    const store = new Store();

    const storePromise = store.getItem(strings.user);

    storePromise.then(this.doIfGetUserSuccess).catch(this.doIfGetUserFailure)
  };

  doIfGetUserSuccess = (userString) => {
    const user = JSON.parse(userString);
    this.setState({ user });
  };

  doIfGetUserFailure = (error) => {
    Toast.show(error.message, Toast.LONG);
  };

  loadServices = () => {
    const getCompany = new GetCompany();
    const companyPromise = getCompany.begin();
    companyPromise.then(this.doWhenGetCompanySuccess).catch(this.doOnApiFailure);
  };

  doWhenGetCompanySuccess = (company) => {
    this.setState({ company }, () => {
      const servicesForCompany = new ServicesForCompany(company.AccountId);
      const servicesPromise = servicesForCompany.getServices();
      servicesPromise.then(this.doWhenGetServicesSuccess).catch(this.doOnApiFailure);
    });
  };

  doWhenGetServicesSuccess = (services) => {
    this.setState({ loadingServices: false, services });
  };

  doOnApiFailure = (error) => {
    Toast.show(error.message, Toast.LONG);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(224, 224, 224)',
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
  },

  listContainer: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5,
    width: '100%',
  },
});