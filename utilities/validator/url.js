const isUrlValid = (url) => {
  const urlRegex = /^(https?:\/\/(www\.)?)/;

  return urlRegex.test(url);
};

module.exports = { isUrlValid };
