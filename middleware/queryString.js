//  queryString中间件
module.exports = function (req, res, next) {
    req.query = url.parse(req.url, true).query;
    next();
};