///////////////////////////
// 加密解密算法
//本系统使用rc4加密解密,algorithm=rc4
//key='jiaojsys'
///////////////////////////
var crypto = require('crypto');
fs = require('fs');

//加密
// function cipher(algorithm, key, buf ,cb){
//     var encrypted = "";
//     var cip = crypto.createCipher(algorithm, key);
//     encrypted += cip.update(buf, 'binary', 'hex');
//     encrypted += cip.final('hex');
//     cb(encrypted);
// }

//解密
// function decipher(algorithm, key, encrypted,cb){
//     var decrypted = "";
//     var decipher = crypto.createDecipher(algorithm, key);
//     decrypted += decipher.update(encrypted, 'hex', 'binary');
//     decrypted += decipher.final('binary');
//     cb(decrypted);
// }

// function cipherDecipherFile(filename,algorithm, key){
//     fs.readFile(filename, "utf-8",function (err, data) {
//         if (err) throw err;
//         var s1 = new Date();

//         cipher(algorithm, key,data,function(encrypted){
//             var s2 = new Date();
//             console.log('cipher:'+algorithm+','+(s2-s1) +'ms');

//             decipher(algorithm, key,encrypted,function(txt){
//                 var s3 = new Date();
//                 console.log('decipher:'+algorithm+','+(s3-s2) +'ms');
// //                console.log(txt);
//             });
//         });
//     });
// }

function encrypteFunc(){

}
//加密
encrypteFunc.cipher=function(algorithm, key, buf ,cb){
    var encrypted = "";
    var cip = crypto.createCipher(algorithm, key);
    encrypted += cip.update(buf, 'binary', 'hex');
    encrypted += cip.final('hex');
    cb(encrypted);
};
encrypteFunc.key='jiaojsys';
encrypteFunc.algorithm='rc4';
//解密
encrypteFunc.decipher=function (algorithm, key, encrypted,cb){
    var decrypted = "";
    var decipher = crypto.createDecipher(algorithm, key);
    decrypted += decipher.update(encrypted, 'hex', 'binary');
    decrypted += decipher.final('binary');
    cb(decrypted);
}
module.exports=encrypteFunc;