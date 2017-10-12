export function isEmptyString(str) {
    return (!str || 0 === str.length);
}

export function isValidEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  return re.test(email);
}

export function isJsonString(string) {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  
  return true;
}

export function formatPrice(cents) {
    return (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}