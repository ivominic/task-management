# First nest.js project

## Dependency injection

Dependency injection is done through controllers class constructor. After that, service is available inside that class/controller.

## DTO - data transfer object

DTO is class that stores information about data types for properties passed to another function/api/procedure. Allows to change property type at one place and changes will be propagated. DTO can be created for each model, in dto subfolder.

## Validation and error handling

To use pipes for validation, validator and transformer package needs to be installed. It is done with command:
npm install class-validator class-transformer --save
After that, validators and pipes are used like decorators over properties and methods.
For validations, create class/pipe inside pipes subfolder, of each model/class, and invoke it inside decorators (@Body, @Query, @Param) adding ValidationPipe. No need to create new instance, it is done automaticaly. Pipe class has to implement PipeTransform interface, that require transform() function with parameters value, and optional parameter metadata. This metod returns transformed value (if needed) or throw exception.

## Database and TypeORM

npm install @nestjs/typeorm typeorm pg --save
This command installs specific bridge that nestjs uses to work with typeorm, typeorm and driver for PostgreSQL database.
There are multiple ways of configuring database connection. One way is static json file, another one is providing the data as an object, third way would be providing data asynchronously from a service.
Create new folder under the src folder and inside typeorm.config.ts file with export of TypeOrmModuleOptions object.

## Entities

Entities help us not to write queries. Created file task.entity.ts where we are declaring class to map database table.

## Repositories

Creating new file task.repository.ts to export repository class which we import in task.module.ts, forFeature, and it makes it consumable from service.

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
