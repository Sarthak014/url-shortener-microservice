const { URLShortner } = require("../model/URLShortner");
const { generateRandomNumber, isNumExistInDB } = require("../utilities/random");

const findUrlByCode = async (id, done) => {
  try {
    const data = await URLShortner.findOne(
      { shortUrlCode: id },
      { shortUrlCode: 1, originalUrl: 1, _id: 0 }
    );

    done(null, data?.originalUrl);
  } catch (error) {
    done(error, null);
  }
};

const findByUrl = async (url) => {
  const data = await URLShortner.findOne(
    { originalUrl: url },
    { shortUrlCode: 1, originalUrl: 1, _id: 0 }
  );

  return { urlExist: data ? true : false, data };
};

const createAndSaveUrl = async (url, done) => {
  try {
    let response;
    let randomNumber = generateRandomNumber();

    const { urlExist, data } = await findByUrl(url);
    const allShortUrlCodes = await URLShortner.find(
      {},
      { shortUrlCode: 1, _id: 0 }
    );

    if (urlExist && data) {
      response = {
        original_url: data?.originalUrl,
        short_url: data?.shortUrlCode,
      };

      done(null, response);
    }

    if (
      isNumExistInDB(allShortUrlCodes, randomNumber) &&
      allShortUrlCodes?.length
    ) {
      do {
        randomNumber = generateRandomNumber();
      } while (isNumExistInDB(allShortUrlCodes));
    }

    // Save the new Url in DB and send back to client with a unique code for that particular url
    const shorten_url = new URLShortner({
      shortUrlCode: randomNumber,
      originalUrl: url,
    });

    const savedShortUrl = await shorten_url.save();

    response = {
      original_url: savedShortUrl.originalUrl,
      short_url: savedShortUrl.shortUrlCode,
    };

    done(null, response);
  } catch (error) {
    done(error, null);
  }
};

module.exports = { createAndSaveUrl, findUrlByCode };
