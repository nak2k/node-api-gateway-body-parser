# api-gateway-body-parser

Body parsing middleware for API Gateway.

## Installation

```
npm i api-gateway-body-parser -S
```

## Usage

``` javascript
const apiGatewayBodyParser = require('api-gateway-body-parser');

const app = express();

app.use(apiGatewayBodyParser({
  binaryMediaTypes: [ 'image/*' ],
  limit: '10mb',
}));
```

## apiGatewayBodyParser(options)

Generate a middleware to parse the request body as binary data.

- `binaryMediaTypes`
  - An array of string that `Content-Type` is assumed as binary data.
- `limit`
  - A maximum limit of the request body.

The generated middleware adds `body` and `isBase64Encoded` properties to `req`.

## License

MIT
