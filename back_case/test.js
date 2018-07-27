
module.exports = {
    afunc: function () {

        console.log("运行了函数");
        return "运行定义函数";
    },
    b: "13",
    c: function () {
        var str = "aaabbbcccaaabbbccc";   
　　var res = str.match(/aaa/); //没有使用g选项   
        var str = 'aaabbbcccaaabbbccc';
        　　var regExp = /aaa/; //未使用g选项   
        　　var res = regExp.exec(str);
        var ac = new object;
        ac.a = 1;
        ac.b = function () { return "c" };
        return "运行默认函数";

    }

}


