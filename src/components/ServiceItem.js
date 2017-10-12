import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, Text, TouchableHighlight, Alert, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Store from '../apis/Store';
import { colors } from '../constants/colors';
import { strings } from '../constants/strings';
import { formatPrice } from '../helpers';

class ServiceItem extends Component {  
  constructor(props) {
    super(props);

    this.state = {
      iconUri: null,
    };
  }

  render() {
    const { service } = this.props;
    const { iconUri } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.mainInfo}>
          <View style={[styles.mainInfoImageContainer, styles.mainInfoImage]}>
            <Image
              style={styles.mainInfoImage}
              source={{uri: iconUri ? iconUri : service.icon.placeholder}}
            />
          </View>
          <View style={styles.mainInfoTextArea}>
            <Text style={styles.owner}>{service.OwnerName}</Text>
            <Text numberOfLines={3} style={styles.serviceName}>{service.DisplayName}</Text>
          </View>
        </View>
        <View style={styles.subscriptionArea}>
          <View style={styles.subscriptionAreaPriceInfo}>
            <Text style={styles.priceInfoText}>From {formatPrice(service.price)} €/month</Text>
          </View>

           <TouchableHighlight onPress={this.handleAddService} underlayColor="white"  style={{height: '100%'}}>
            <View style={styles.button}>
              <MaterialIcons name="add-circle" size={30} color="#fff" />
              <Text style={styles.buttonText}>{strings.addService}</Text>
            </View>
          </TouchableHighlight> 
        </View>
      </View>
    );
  }

  handleAddService = () => {
    const { service, onAddService } = this.props;
    
    onAddService(service);
  };

  componentDidMount() {
    this.getIcon();
  }

  getIcon = () => {
    const store = new Store();

    const storePromise = store.getItem(strings.token);

    storePromise
    .then(this.doWhenGetTokenSuccess)
    .catch(this.doWhenGetTokenFailure);
  };

  doWhenGetTokenSuccess = (token) => {
    const { icon } = this.props.service;

    const iconUri = `https://marketplacetest.ccpaas.net/keeper/getimage/${icon.path}/75/75?sessionToken=${token}`;

    this.setState({ iconUri });
  }

  doWhenGetTokenFailure(error) {
    console.error('ServiceItem.doWhenGetTokenFailure', error);
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
  },

  mainInfo: {
    flexDirection: 'row',
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 15,
  },

  mainInfoImageContainer: {
    backgroundColor: 'grey',
  },

  mainInfoImage: {
    width: 75,
    height: 75,
  },

  mainInfoTextArea: {
    backgroundColor: 'white',
    flex: 1,
    marginLeft: 15,
  },

  owner: {
    fontSize: 12.5,
    color : '#919395',
  },

  serviceName: {
    fontSize: 16.5,
    color : '#000',
  },

  subscriptionArea: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(242, 242, 242)',
  },

  subscriptionAreaPriceInfo: {
    height: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
  },

  priceInfoText: {
    fontSize: 14.5,
    color: 'black',
  },

  button: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.alsoGreen,
    paddingLeft: 20,
    paddingRight: 20,
  },

  buttonText: {
    fontSize: 14.5,
    color: 'white',
    marginLeft: 10,
  },
});

ServiceItem.propTypes = {
  service: PropTypes.object.isRequired,
  onAddService: PropTypes.func,
};

export default ServiceItem;