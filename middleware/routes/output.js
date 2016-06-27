module.exports = function () {
    var url = this.query.url;
    var host = url.match(/[a-z0-9.\-]+[.][a-z]{2,4}(?:\/|$)/);
    this.render('output', {
        url: url,
        host: host && host[0]
    });
};