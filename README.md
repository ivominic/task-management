# First nest.js project

## Dependency injection

Dependency injection is done through controllers class constructor. After that, service is available inside that class/controller.

## DTO - data transfer object

DTO is class that stores information about data types for properties passed to another function/api/procedure. Allows to change property type at one place and changes will be propagated. DTO can be created for each model, in dto subfolder.

## Validation and error handling

To use pipes for validation, validator and transformer package needs to be installed. It is done with command:
npm install class-validator class-transformer --save
After that, validators and pipes are used like decorators over properties and methods.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
