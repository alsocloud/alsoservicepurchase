import React, { Component } from 'react';
import { ActivityIndicator, ScrollView, View, Text, TextInput, Picker, Switch, StyleSheet } from 'react-native';
import Toast from 'react-native-simple-toast';
import FieldsForService from '../apis/FieldsForService';
import CreateSubscription from '../apis/CreateSubscription';
import Toolbar from '../components/Toolbar';
import SecondaryToolbar from '../components/SecondaryToolbar';
import FinishButton from '../components/FinishButton';
import Spinner from 'react-native-loading-spinner-overlay';

export default class ConfigurationScreen extends Component {
  static navigationOptions = {
    header: <Toolbar/>,
  };
  
  constructor(props) {
    super(props);

    this.state = {
      loadingFields: false,
      fields: [],
      fieldsToSubmit: {},
      fieldsToSubmitError: {},
      creatingSubscription: false,
    };
  }
  
  render() {
    const { loadingFields, fields, creatingSubscription } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <SecondaryToolbar
          title={`Configuration`}
          from="AvailableServices"
          navigation={navigation}
          secondaryButton={<FinishButton onFinish={this.handleFinish} />}
        />

        <View style={styles.content}>
          { loadingFields ? this.renderLoading() : null }

          { fields.length > 0 ? this.renderFields() : null }
        </View>

        <Spinner visible={creatingSubscription} />
      </View>
    );
  }
  
  renderLoading = () => {
    return (
      <View style={styles.loading}>
        <ActivityIndicator/>
      </View>
    );
  };
  
  renderFields = () => {
    const { fields } = this.state;

    return (
      <ScrollView style={styles.fieldsContainer}>
        { fields.map(this.renderField) }
      </ScrollView>
    );
  };

  renderField = (field) => {
    switch(field.DisplayTemplate) {
      case 'Combobox':
        return this.renderPicker(field);
        break;
      
      case 'Checkbox':
        return this.renderSwitch(field);
        break;

      default:
        return this.renderTextInput(field);
    }
  };

  renderTextInput = (field) => {
    const { fieldsToSubmit, fieldsToSubmitError } = this.state;

    const editable = field.DisplayType === 'ReadOnly' ? false : true;keyboardType
    const keyboardType = field.DisplayTemplate === 'Numeric' ? 'numeric' : 'default';

    return (
      <View key={field.Name} style={styles.fieldContainer}>
        <View style={styles.field}>
          {this.renderFieldLabel(field)}

          <View  style={[styles.fieldInputContainer, fieldsToSubmitError[field.Name] ? styles.fieldInputContainerError : null]}>
            <TextInput
              editable={editable}
              keyboardType={keyboardType}
              defaultValue={fieldsToSubmit[field.Name]}
              onChangeText={(text) => this.onFieldValueChange(field.Name, text)}
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.divider} />
      </View>
    );
  };

  renderPicker = (field) => {
    const { fieldsToSubmit, fieldsToSubmitError } = this.state;

    field = this.addValuelessOptionForComboboxWithoutDefault(field);

    return (
      <View key={field.Name} style={styles.fieldContainer}>
        <View style={styles.field}>
          {this.renderFieldLabel(field)}

          <View  style={[styles.fieldInputContainer, fieldsToSubmitError[field.Name] ? styles.fieldInputContainerError : null]}>
            <Picker
              selectedValue={fieldsToSubmit[field.Name]}
              onValueChange={(itemValue, itemIndex) => this.onFieldValueChange(field.Name, itemValue)}
            >
              {
                field.EnumMembers.map((item) => <Picker.Item key={item.Value} label={item.DisplayName} value={item.Value} />)
              }
            </Picker>
          </View>
        </View>

        <View style={styles.divider} />
      </View>
    );
  };
  
  addValuelessOptionForComboboxWithoutDefault = (field) => {
    if (!field.DefaultValue) {
      const index = field.EnumMembers.findIndex((option) => {
        return option.DisplayName === `-- Select ${field.DisplayName} --`;
      });

      if (index === -1) {
        field.EnumMembers.splice(0, 0, { DisplayName: `-- Select ${field.DisplayName} --`, Value: null });
      }
    }

    return field;
  };
  
  renderSwitch = (field) => {
    const { fieldsToSubmit, fieldsToSubmitError } = this.state;

    const value = fieldsToSubmit[field.Name] === 'true' ? true : false;

    return (
      <View key={field.Name} style={styles.fieldContainer}>
        <View style={styles.field}>
          {this.renderFieldLabel(field)}

          <View  style={[styles.fieldInputContainer, fieldsToSubmitError[field.Name] ? styles.fieldInputContainerError : null]}>
            <Switch
              value={value}
              onValueChange={(itemValue, itemIndex) => this.onFieldValueChange(field.Name, itemValue ? 'true' : 'false')}
            />
          </View>
        </View>

        <View style={styles.divider} />
      </View>
    );
  };

  renderFieldLabel = (field) => {
    return <Text>{field.DisplayName}{field.DisplayType === 'Mandatory' || field.DisplayType === 1 ? ' *' : null}</Text>;
  };

  onFieldValueChange = (fieldName, fieldValue) => {
    const { fieldsToSubmit } = this.state;
    fieldsToSubmit[fieldName] = fieldValue;

    this.setState({ fieldsToSubmit });
  }

  handleFinish = () => {
    const { fieldsToSubmit } = this.state;

    if (this.fieldsAreValid(fieldsToSubmit)) {
      this.doIfFieldsAreValid();
    }
  };

  fieldsAreValid = (fieldsToSubmit) => {
    let fieldsAreValid = true;

    const { fields, fieldsToSubmitError } = this.state;

    for (fieldToSubmitKey in fieldsToSubmit) {
      const fieldDetails = fields.find((field) => {
        return field.Name === fieldToSubmitKey;
      });

      if (fieldDetails.DisplayType === 'Mandatory' || fieldDetails.DisplayType === '1' || fieldDetails.DisplayType === 1) {
        if (!fieldsToSubmit[fieldToSubmitKey]) {
          fieldsToSubmitError[fieldDetails.Name] = true;

          fieldsAreValid = false;

          continue;
        } else {
          fieldsToSubmitError[fieldDetails.Name] = false;
        }
      }

      if (fieldDetails.Validator) {
        if (!this.isValid(fieldsToSubmit[fieldToSubmitKey], fieldDetails.Validator)) {
          fieldsToSubmitError[fieldDetails.Name] = true;

          fieldsAreValid = false;
        } else {
          fieldsToSubmitError[fieldDetails.Name] = false;
        }
      }
    }

    this.setState({ fieldsToSubmitError });

    return fieldsAreValid;
  }

  isValid = (value, validator) => {
    const re = new RegExp(validator);
    return re.test(value);
  }

  doIfFieldsAreValid = () => {
    this.setState({ creatingSubscription: true });
    const validApiFields = this.parseForValidApiFields();
    
    this.createSubsciption(validApiFields);
  };
  
  parseForValidApiFields = () => {
    const { fields, fieldsToSubmit } = this.state;
    let validApiFields = {};

    for (fieldToSubmitKey in fieldsToSubmit) {
      const fieldDetails = fields.find((field) => {
        return field.Name === fieldToSubmitKey;
      });
  
      validApiFields[fieldToSubmitKey] = this.getValidTypeValue(fieldDetails.Type, fieldsToSubmit[fieldToSubmitKey]);
    }

    return validApiFields;
  };

  getValidTypeValue = (type, value) => {
    switch (type) {
      case 'int32':
        return Number(value);
      default:
        return value;
    }
  };

  createSubsciption = (validApiFields) => {
    const { service, parentAccountId } = this.props.navigation.state.params;

    const createSubscription = new CreateSubscription( validApiFields, parentAccountId, service.ProductName );
    const promise = createSubscription.create();

    promise.then(this.doOnCreateSubscriptionSuccess).catch(this.doOnCreateSubscriptionFailure);
  };
  
  doOnCreateSubscriptionSuccess = (data) => {
    const { goBack, state } = this.props.navigation;
    goBack();
    state.params.onPurchaseComplete(data);
  };
  
  doOnCreateSubscriptionFailure = (error) => {
    Toast.show(error.message, Toast.LONG);

    this.setState({ creatingSubscription: false });
  };

  componentDidMount() {
    this.setState({ loadingFields: true }, this.loadFields);
  }

  loadFields = () => {
    const { service, parentAccountId } = this.props.navigation.state.params;

    console.log('service', service);
    console.log('parentAccountId', parentAccountId);

    const fieldsForService = new FieldsForService(service, parentAccountId);
    const promise = fieldsForService.getFields();

    promise.then(this.doOnGetFieldsSuccess).catch(this.doOnGetFieldsFailure);
  }

  doOnGetFieldsSuccess = (fields) => {
    let fieldsToSubmit = {};

    for (field of fields) {
      fieldsToSubmit[field.Name] = field.DefaultValue ? field.DefaultValue : null;
    }

    this.setState({ loadingFields: false, fields, fieldsToSubmit });
  };

  doOnGetFieldsFailure = (error) => {
    Toast.show(error.message, Toast.LONG);

    this.setState({ loadingFields: false });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fieldsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    margin: 10,
  },

  fieldContainer: {
    backgroundColor: 'white',
  },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 15,
  },

  fieldInputContainer: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: 'transparent',
  },

  textInput: {
    textAlign: 'right'
  },

  fieldInputContainerError: {
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: 'red',
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e6',
    marginLeft: 15,
  },
});