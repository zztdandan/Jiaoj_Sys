var client = require('ftp');

var ftp_client = function () {
    var c = new client();
    c.connect({
        host: "127.0.0.1",
        port: 21,
        user: "jiaojftp",
        password: "jiaojftp"
    })
    c.put()
    return c;
}

module.exports = ftp_client;