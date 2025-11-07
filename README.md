# Specmatic Sample: Nodejs-Express Order API

- [Specmatic Website](https://specmatic.io)
- [Specmatic Documentation](https://docs.specmatic.io)

This sample project illustrates the implementation of contract-driven development and contract testing within a Nodejs(Express) application. In this context, Specmatic is utilized to function as a client, making calls to API service according to its OpenAPI specification to validate its functionality.

Here is the API's [contract/open api spec](https://github.com/specmatic/specmatic-order-contracts/blob/main/io/specmatic/examples/store/openapi/api_order_v3.yaml) governing the interaction of the client with the product API.

## Tech

1. Express
2. Specmatic
3. Jest
4. Docker Desktop

## Setup

1. Install [NodeJS](https://nodejs.org/en)
2. Install JRE 17 or later.
3. Install Docker Desktop

## Install Dependencies

To install all necessary dependencies for this project, navigate to the project's root directory in your terminal and execute

```shell
npm install
```

## Execute Tests and Validate Contracts with Specmatic

Executing this command will initiate Specmatic and execute the tests on the Nodejs(Express) application.

```shell
npm run test
```
