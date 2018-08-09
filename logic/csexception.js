var csexception = function (bol, msg, data) {
    if (typeof bol != 'boolean') { throw new Error('错误的bol'); }
    if (typeof msg != 'string') { throw new Error('错误的msg'); }
    this.flag = bol;
    this.msg = msg;
    this.code = 0;
    this.data = data;
    this.jsonreturn = function () {
        return {
            'flag': this.flag,
            'code': this.code,
            'msg': this.msg,
            'data': this.data
        };
    };
};
csexception.new = function () {
    return new csexception(true, 'success', {});
};

module.exports = csexception;