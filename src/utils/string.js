const camelize = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
};

const capitalizeFirstLetter = (str) => {
  return str
    .split(" ")
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
    .join(" ");
};

module.exports = {
  camelize,
  capitalizeFirstLetter
};
