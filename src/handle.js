import Joi from 'joi';

import {
  BadRequestError
} from './errors';

/**
 * Validates message against a schema and returns a Promise.
 * Promise will resolve with validated and sanitized object
 * or reject with BadRequestError.
 * @param msg The message to validate
 * @param schema The Joi schema to validate against
 * @returns {Promise}
 * @private
 */
const _promisedValidate = (msg, schema) => {
  return new Promise((resolve, reject) => {
    Joi.validate(msg, schema, {
      stripUnknown: true
    }, (err, value) => {
      if (err) {
        reject(new BadRequestError(err.details[0].message, err.details[0].path));
      } else {
        resolve(value);
      }
    });
  });
};

const optsSchema = Joi.object().keys({
  reqSchema: Joi.object().required(),
  resSchema: Joi.object().optional(),
  handler: Joi.func().required()
});

/**
 * builds a strongly-typed service handler
 * @param opts {reqSchema, resSchema, handler}
 * @returns {function()}
 */
const handle = (opts) => {
  const result = Joi.validate(opts, optsSchema);

  if (result.error) {
    throw result.error;
  }

  const o = result.value;

  return (reqData, ctx) => {
    return _promisedValidate(reqData, o.reqSchema)
      .then((reqMsg) => {
        return o.handler(reqMsg, ctx);
      })
      .then((resMsg) => {
        if (o.resSchema) {
          return _promisedValidate(resMsg, o.resSchema);
        } else {
          return resMsg;
        }
      });
  };
};

export default handle;
