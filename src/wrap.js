import assignIn from 'lodash/assignIn';

/**
 * wraps a service handler as an express
 * route. Passes req content and context {req, res}
 * @param handler
 * @returns {function()}
 */
const wrap = (handler) => {
  return (req, res, next) => {
    const reqContent = assignIn({}, req.body, req.query, req.params);

    const ctx = {req, res};

    return handler(reqContent, ctx)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  }
};

export default wrap;
