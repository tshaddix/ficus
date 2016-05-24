# ficus

An extremely simple set of utilities for building service-based APIs in ExpressJS.

## The Basics

### Install

```
npm install --save ficus
```

```
import {
    // utility functions
    handle,
    wrap,

    // errors
    AppError,
    HttpError,
    NotFoundError,
    ForbiddenError,
    InternalServerError,
    UnauthorizedError,
    BadRequestError,
    ConflictError
} from 'ficus';
```

### Usage

Ficus is focused on building service-based APIs. Instead of writing routes, you write services. Service methods can be composed and reused from other services. Service methods also export as very simply functions, allowing easy testing and a scalable API. To accomplish this, ficus has two utility functions: `handle` and `wrap`.

#### `handle(opts)`

The handle function's main purpose is to map a request object against a schema, run it through a handler function, and then pass the result back through a response schema. This enforces a tight contract for your service methods.

`@param opts {object}`
- `reqSchema`: [Joi](https://github.com/hapijs/joi) schema representing the form of the request object
- `resSchema`: [joi](https://github.com/hapijs/joi) schema representing the form of the response object
- `handler(reqData, ctx)`: Service handler
    - `reqData`: The request data validated and sanitized through `reqSchema`
    - `ctx`: Object of form `{req, res}` that allows access to original request values (if present)

`@returns Promise` Promise will resolve with final value after the `req -> handle -> res` process.


##### Example

```
import {handle} from 'ficus';

const getUsers = handle({
    reqSchema: Joi.object().keys({
        query: Joi.string().required()
        offset: Joi.number().default(0),
        limit: Joi.number().default(10)
    }),
    resSchema: Joi.object().keys({
        users: Joi.array().items(Joi.string()).required()
    }),
    handle({query, offset, limit}) {
        // Some ORM call
        return User
            .find(query)
            .limit(limit)
            .offset(offset)
            .then(users => users.map(u => u.name));
    }
});

// Good service call
getUsers({
    query: 'ficus'
})
.then(({users}) => {
     // users => ['ficus', 'ficus tree', 'ficus plant']
});

// Bad sevice call
getUsers({})
    .catch(err => {
        // err => Bad Request Error, 'query' is required
    });
```
