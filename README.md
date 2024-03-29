# First nest.js project

## Dependency injection

Dependency injection is done through controllers class constructor. After that, service is available inside that class/controller.

## DTO - data transfer object

DTO is class that stores information about data types for properties passed to another function/api/procedure. Allows to change property type at one place and changes will be propagated. DTO can be created for each model, in dto subfolder.

## Validation and error handling

To use pipes for validation, validator and transformer package needs to be installed. It is done with command:
npm install class-validator class-transformer --save
After that, validators and pipes are used like decorators over properties and methods.
For validations, create class/pipe inside pipes subfolder, of each model/class, and invoke it inside decorators (@Body, @Query, @Param) adding ValidationPipe. No need to create new instance, it is done automatically. Pipe class has to implement PipeTransform interface, that require transform() function with parameters value, and optional parameter metadata. This method returns transformed value (if needed) or throw exception.

## Database and TypeORM

npm install @nestjs/typeorm typeorm pg --save
This command installs specific bridge that nestjs uses to work with typeorm, typeorm and driver for PostgreSQL database.
There are multiple ways of configuring database connection. One way is static json file, another one is providing the data as an object, third way would be providing data asynchronously from a service.
Create new folder "config" under the src folder and inside typeorm.config.ts file with export of TypeOrmModuleOptions object. Import this in app.modules.ts file.
QueryBuilder is a part of TypeORM that helps creating database queries.

## Entities

Entities help us not to write queries. Created file task.entity.ts where we are declaring class to map database table.

## Repositories

Creating new file task.repository.ts to export repository class which we import in task.module.ts, forFeature, and it makes it consumable from service. There will be created standard methods for CRUD operations.

## Authentication and Authorization

Command "nest g module auth" creates module that will contain all things related to users and auth functions. Created controller and service using commands "nest g controller auth --no-spec" and "nest g service auth --no-spec". Create new file under auth folder named user.entity.ts and user.repository.ts that will contain all the heavy database related code (CRUD). Then in auth.module.ts import TypeOrmModule.forFeature that needs to be provided with array of entities or repositories. That means that UserRepository should be available for injection, throughout auth module. Then we need to inject UserRepository into auth.service to initialize that service. AuthService needs to be injected into AuthController.

Then, dto folder is created, inside auth folder, with auth-credentials.dto.ts file that will store dto for user credentials, that will, for now, be used for sign-up and sign-in methods, since both of them use only username and password. There will be applied validation rules. @Matches decorator sets regular expression that filed needs to fulfill to be validated. ValidationPipe needs to be added into auth.controller, for selected method, in @Body() decorator. This covers validation of parameters. Passing message object, as a second part of the @Matches() decorator will present that message to the user, if password doesn't pass that validation.

## Hash and salt

First install bcrypt using command "npm i bcrypt --save". Then in user.repository.ts, before saving user, crypt password. Add new column "salt" in user.entity and store salt, which is different for each user. In user.entity is created method for validating password (no need to pass user entity that way), and called from signin methods in controller->service->repository. If user is authenticated, signin method returns username, null otherwise.

## Passport.js

First install several packages: "npm i @nestjs/jwt @nestjs/passport passport passport-jwt". Then JwtModule should be imported in auth.module.ts and using JwtModule.register() need to provide configuration, like secret - which is secret value that will be used to sign token and setting expire time of jwt to 3600 seconds. In the same auth module, we are importing nad registering passport module - setting appropriate strategy. Registering JwtModule, we are able to use JwtService in auth.service.ts. In signIn method, after validating username, we are creating payload that stores username. It can store additional information like roles and what should be disabled. Then we generate jwt for payload, and return signed accessToken. It is better to extract payload structure into interface, because it will be used throughout application. For that, we are going to create new file in auth folder: jwt-payload.interface.ts and use that interface in signIn method to define type of payload object. Then change return type of signIn method to Promise<{accessToken: string{}>. Same is done for signIn method in auth.controller.ts. At this point, application returns access token for each valid call of signin method.
JWT strategy will be defined in file jwt.strategy.ts. In constructor -> super will be defined how to get JWT and secret (same value as in auth.module.ts register method). Each strategy (file) has to have validate method. If secret doesn't match, it will throw an error, else validate() method will be called. At moment of passing payload to validate method, that value is already verified, so we know it is legitimate. Validate method returns user object (entity). We need to add JwtStrategy as a provider in auth.module.ts. Also, we are setting exports for auth.module, so it can be used in other modules that need this JWT strategy, as well as PassportModule, that, after configuring it, can be used to guard methods in other modules.
In auth.controller will be created temporary method test() that can be guarded with decorator @UseGuards(AuthGuard()) and will retrieve entire request object. This method (test) will return error 401 Unauthorized if not provided with access token, that needs to be generated from signin method. Because of the defined strategy to extract bearer token from auth header, we need to pass received access token as a bearer. It will be passed as Authorization parameter in the Headers tab of post request and value will be "Bearer ${accessTokenValue}" without quotation marks. Printing request, it will show complete user object, so we can automatically use that user for the rest of the method. AuthGuard can be put on controller level, or on each method separately.

## GetUser decorator

Retrieving user from request can be simplified by creating decorator. We create file get-user.decorator.ts and export GetUser method that accepts data and ExecutionContext and returns user object from request. Data won't be used for now. To make this work, we change parameters for test method in auth.controller in a way to replace test(@Req() req) with test(@GetUser() user: User).

## Tasks module

First, we import AuthModule to TasksModule to have all methods regarding authentication available in TasksModule. Then we use AuthGuard() on Tasks controller. Then, call get method tasks with access token passed in Auth tab of Postman/Thunder client and select Bearer option.

## OneToMany and ManyToOne relations

In user.entity and task.entity we add columns tasks and user, with type, accessing inverse object (user from task and task object from user entity) as well as eager option. If this option is set to true, like for tasks array in user entity, it means that each user object is loaded with all tasks for that user object (related to that user). In task.controller, createTask method will be expanded with one additional parameter user, which will decorate with previously created decorator @GetUser(). createTask method in task.repository returns whole user object with created task. That is the reason for deleting task.user after saving task. That deletes user only from returning object, not from database. In task.entity we need to add userId column, if we want to use it in queries. This column is already created in database by ORM, when we created ManyToOne relations.

## Logging

Logger has several levels: General, Warning, Error, Debug and Verbose. It is part of @nestjs/common package and we will first create one logger in main.ts file, although it's not necessary. Logger has a context, and in main.ts file it will be 'bootstrap' because it is invoked in bootstrap() method. First logging will be after application runs, and it will log that application listening on specific port. In controller, services etc loggers are created as private members, with context as a parameter. Example in tasks.controller.ts. Logger.error() method can accept e.stack message as a second parameter.

## Production configuration

Install config package with command "npm i config". This package expects "config" folder in the root folder of the application, so we need to create it and file named default.yml in it. Populate this file with parameters regarding server port, database and jwt expiration time. Then we create development.yml file in the same folder. This file will inherit all values from default.yml and override some of them with values specific for development stage. Next is production.yml file. To consume this configurations, in main.ts we need to import config package and get object from yml files using config.get('object_name'). If environment variable NODE_ENV is not set, it means we are in development stage. In main.ts we first try to read port from environment variable PORT, and if not set, then read from yml file. Next, we change src/config/typeorm.config.ts file, replacing hardcoded values with config. Anything we put into default.yml file will be available in all stages (dev, prod, test...) and we can override values with other files. Next file to edit is auth.module.ts to change values regarding JWT. Same change is done in jwt.strategy.ts file.

## CORS

To enable CORS, in main.ts we should to add only one line: app.enableCors();. In production, this should be removed, and only whitelist addresses from which we allow consuming this services.

## Testing

Nestjs comes with preinstalled testing framework - Jest. Jest expects that test files end with .spec.ts. We will create file task/task.service.spec.ts in src folder. This file will contain specifications for tests. Before running test, we need to create test.yml file in config folder, with parameters for testing. In this project, we have copied content from development.yml.Second option is to run test with NODE_ENV=development parameter and tests will use config file for development stage. Describe sets name of the test, and contains all test for class. Since we want to initialize object before each test, we well create initialization of global properties inside beforeEach() method. CreateTestingModule allows us to include only parts that we want to test, from original module. Mocking task repository is needed in order to not use our database, for object creating/updating/deleting. Object in this function is in parenthesis, which means it is going to be returned immediately. Module can be used after compiling.To test getTasks method, we need to mock it first (getTasks: jest.fn()). We also mocked user that will be used in all test. Test fail for me, because User could not be loaded from task.entity.ts

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

## License

Nest is [MIT licensed](LICENSE).
```
