var co = require('co')
var OSS = require('ali-oss')

var isPro = (document.location.hostname === 'www.mytijian.com' ||
            document.location.hostname === 'vip.mytijian.com' ||
            document.location.hostname === 'mytijian.com')

// 测试库
var testClient = new OSS.Wrapper({
  region: 'oss-cn-shanghai',
  accessKeyId: '7Xrl34cpSSg8lIIj',
  accessKeySecret: '9hnbeQfe6P4JbWTkb9x85xrxni2iWp',
  bucket: 'test-i',
})

// 线上库
var ProClient = new OSS.Wrapper({
  // region: 'oss-cn-hangzhou',
  accessKeyId: '7Xrl34cpSSg8lIIj',
  accessKeySecret: '9hnbeQfe6P4JbWTkb9x85xrxni2iWp',
  bucket: 'mytijian-img',
  endpoint: 'https://oss-cn-hangzhou.aliyuncs.com',
})

var client = isPro ? ProClient : testClient

// 阿里云oss文件上传下载服务
var OssClient = {

  addOssObject: function (targetPath, file) {
    return client.multipartUpload(targetPath + file.name, file)

    // co(function* () {
    //   var result = yield client.put('/official-web/' + file.name, file);
    //   console.log(result);
    // }).catch(function (err) {
    //   console.log(err);
    // });
  },

  deleteOssObject: function (targetPath, file) {
    var filePath = targetPath + file.name
    return client.delete(filePath)
  },

  endpoint: isPro ? 'https://mytijian-img.oss-cn-hangzhou.aliyuncs.com' : 'http://test-i.oss-cn-shanghai.aliyuncs.com',
}

window.OssClient = OssClient
