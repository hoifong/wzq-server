module.exports = function (path) {
    let keys = [];

    path = path
        .concat(strict ? '' : '/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function (_, slash, format, key, capture, optional, star) {
            //  将匹配到的简直保存起来

            keys.push(key);
            slash = slash || '';

            return ''+
                (optional ? '':slash) +
                '(?:' +
                (optional ? slash:'') +
                (format || '') +
                (capture || (format && '([^/.]+?)' || '([^/]+?))')) +
                ')' +
                (optional || '') +
                (star ? '(/*)?':'');

        })
        .replace(/([\/.])/g, '\\$1')
        .replace(/\*/g, '(.*)');

    return {
        keys: keys,
        regexp: new RegExp('^' + path + '$')
    }

};