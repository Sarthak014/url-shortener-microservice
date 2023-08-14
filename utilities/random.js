function generateRandomNumber() {
  const min = 1;
  const max = 10000;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

const isNumExistInDB = (existingCodes, num) => {
  return existingCodes.every(({ shortUrlCode }) => shortUrlCode === num);
};

module.exports = { generateRandomNumber, isNumExistInDB };