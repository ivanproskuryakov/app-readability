### Installation

Install node packages:
`npm install`

Ensure there are no errors by execution of all tests
`npm run test`

### OpenAPI

```
http://0.0.0.0:4000/api/help/openApi
```

### Tests

```
All tests
npm run test

Single test
NODE_ENV=test node ./node_modules/.bin/mocha --require ts-node/register ./src/test/controller/ExecutionController.test.ts

Single test debugging
NODE_ENV=test node --inspect ./node_modules/.bin/mocha --require ts-node/register ./src/test/controller/ExecutionController.test.ts
```
