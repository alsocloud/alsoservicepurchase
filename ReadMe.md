# Also Cloud Service Purchase

This is a mobile project that demonstrates how to create an application that integrates the [Also Cloud SimpleAPI](https://app.swaggerhub.com/apis/Marketplace_SimpleAPI/Mareketplace_SimpleAPI/1.0.0).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes.

### Prerequisites

[React Native](https://facebook.github.io/react-native/docs/getting-started.html)

Note: Follow the instructions for **building native code in a project**. The following should be the last command to complete this setup.

```
npm install -g react-native-cli
```

[Android](https://facebook.github.io/react-native/docs/getting-started.html)

Since this is a React Native project it works on both Android and iOS devices. But the project has only been tested on Android so we recommend this setup.

Note: As with React Native, follow the instructions for **building native code in a project**.

### Installing

Clone the repo into your preferred directory.

```
git clone https://github.com/alsocloud/alsoservicepurchase.git
```

Run "npm install" and after that run "react-native run-android" inside the project folder

```
cd alsoservicepurchase
npm install
react-native run-android
```

## Code Samples

The following samples are written in JavaScript using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

### Non-Authenticated sample:

```
fetch(
  url: 'https://marketplacetest.ccpaas.net/SimpleAPI/SimpleAPIService.svc/rest/${endpoint}',
  {
    method: 'POST',

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

    body: `${requestBodyJsonString}`
  }
)
```


### Authenticated sample:

```
fetch(
  url: `https://marketplacetest.ccpaas.net/SimpleAPI/SimpleAPIService.svc/rest/${endpoint}`,
  {
    method: 'POST',

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authenticate': `CCPSessionId ${token}` // difference between authenticated and non authenticated requests
    },

    body: `${requestBodyJsonString}`
  }
)
```

All implementations of the [Also Cloud SimpleAPI](https://app.swaggerhub.com/apis/Marketplace_SimpleAPI/Mareketplace_SimpleAPI/1.0.0) in this project can be found in the [src/apis](src/apis) folder.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
