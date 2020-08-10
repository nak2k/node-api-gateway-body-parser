/// <reference path="../typings/express.d.ts" />

import contentType = require('content-type');
import getRawBody = require('raw-body');
import typeis = require('type-is');
import type { Request, Response, NextFunction, RequestHandler } from 'express';

interface apiGatewayBodyParserOptions {
  /**
   * An array of string that `Content-Type` is assumed as binary data. (default: [])
   */
  binaryMediaTypes?: string[];

  /**
   * A maximum limit of the request body. (default: '1mb')
   */
  limit?: string;
}

export function apiGatewayBodyParser(options: apiGatewayBodyParserOptions = {}): RequestHandler {
  const {
    binaryMediaTypes = [],
    limit = '1mb',
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
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
}

function getEncoding(req: Request) {
  try {
    return contentType.parse(req).parameters.charset || 'utf8';
  } catch (e) {
    return 'utf8';
  }
}
