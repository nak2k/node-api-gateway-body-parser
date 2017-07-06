const contentType = require('content-type');
const getRawBody = require('raw-body');
const typeis = require('type-is');

module.exports = (options = {}) => {
  const {
    binaryMediaTypes = [],
    limit = '1mb',
  } = options;

  return (req, res, next) => {
    if (!typeis.hasBody(req)) {
      return next();
    }

    if (binaryMediaTypes.length && typeis(req, binaryMediaTypes)) {
      getRawBody(req, {
        length: req.headers['content-length'],
        limit,
      }, (err, data) => {
        if (err) {
          return next(err);
        }

        req.body = data.toString('base64');
        req.isBase64Encoded = true;

        next();
      })
    } else {
      getRawBody(req, {
        length: req.headers['content-length'],
        limit,
        encoding: getEncoding(req),
      }, (err, data) => {
        if (err) {
          return next(err);
        }

        req.body = data;
        req.isBase64Encoded = false;

        next();
      })
    }
  };
};

function getEncoding(req) {
  try {
    return contentType.parse(req).parameters.charset || 'utf8';
  } catch (e) {
    return 'utf8';
  }
}
