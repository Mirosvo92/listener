const validateParams = (data) => {
  for (const property in data) {
    if (!data[property]) {
      return {
        valid: false,
        text: `${property} does not exist`
      }
    }
  }

  return {
    valid: true
  }
}

module.exports = {
  validateParams
};
