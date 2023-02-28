
export const isNumber = (value) => {
  return /^\d+$/.test(value);
}

export const isEmail = (value) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(value).toLowerCase());
}

export const isRequired = (value) => {
  return value ? true : false
}

export const validate = (value, rules) => {
  for (let i = 0; i < rules.length; i++) {
    if (!rules[i].validator(value)) {
      return rules[i].errorMessage;
    }
  }

  return null;
}
