/**
 * @file node-fetch
 * @author Cuttle Cong
 * @date 2018/9/21
 *
 */
const http = require('http')
const u = require('url')
const { Writable } = require('stream')

class Progress extends Writable {
  constructor(opt) {
    super(opt)
    this.body = []
  }
  _write(chunks, encoding, callback) {
    this.body = this.body.concat(chunks)
    // console.log(`Received: ${this.body.length} Bytes`)
    callback()
  }
}

const url = 'http://bos.nj.bpc-internal.baidu.com/ibox-docpreview100/7c09a01b8b7d2d17c283e523ee6fa344?authorization=bce-auth-v1%2Faa63c2039e006dd7e80698dcc7c78d36%2F2018-09-21T03%3A17%3A21Z%2F1800%2F%2F4e98ce677de74abe86a605e05165fd71f822e8b03cd6f4f7ceae17ecc5b53da6&responseContentDisposition=attachment%3Bfilename%3D%E5%BC%B9%E7%AA%97.psd&responseContentDisposition=attachment%3Bfilename%3D%E5%BC%B9%E7%AA%97.psd'
http.request({
  ...u.parse(url),
  headers: {
    host: 'bos.nj.bpc-internal.baidu.com',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Cookie': 'BAIDUID=C3C915DD2C591383D00FB4CDFE33B1B6:FG=1; gr_user_id=7a70e41e-204b-4c6f-a1ba-5ee6a29e6148'
  }
}, function (res) {
  console.log(res.headers)

  res.pipe(new Progress())
}).end()
