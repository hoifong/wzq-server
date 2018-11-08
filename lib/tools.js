module.exports = {
    extend: function (dst, obj) {
        for (var key in obj){
            dst[key] = obj[key];
        }
    }
};