var co = require('co');
var expect = require('expect.js');
var fs = require('fs');
var Storage = require('../');

describe('storage', function () {
  var filepath = __dirname + '/figures/eventproxy-0.3.1.tgz';
  var client = Storage.create({
    oprator: 'test',
    password: 'test1234',
    bucket: 'jackson-test-space'
  });
  var download = __dirname + '/figures/download.tgz';

  var buff;
  var size;
  before(function (done) {
    fs.readFile(filepath, function(err, data) {
      expect(err).to.not.be.ok();
      size = data.length;
      buff = data;
      expect(size).to.be.above(0);
      fs.unlink(download, function (err) {
        if (err) {
          expect(err.code).to.be('ENOENT');
        }
        done();
      });
    });
  });

  it('upload should work', function (done) {
    co(function *() {
      var result = yield client.upload(filepath, {key: '/eventproxy/-/eventproxy-0.3.1.tgz'});
      expect(result.url).to.be('http://jackson-test-space.b0.upaiyun.com/eventproxy/-/eventproxy-0.3.1.tgz');
    })(done);
  });

  it('putBuffer should work', function (done) {
    co(function *() {
      var result = yield client.uploadBuffer(buff, {key: '/eventproxy/-/eventproxy-0.3.1.tgz'});
      expect(result.url).to.be('http://jackson-test-space.b0.upaiyun.com/eventproxy/-/eventproxy-0.3.1.tgz');
    })(done);
  });

  it('download', function (done) {
    co(function *() {
      yield client.download('/eventproxy/-/eventproxy-0.3.1.tgz', download, {});
    })(function (err) {
      expect(err).to.not.be.ok();
      fs.readFile(download, function (err, file) {
        expect(err).to.not.be.ok();
        expect(file.length).to.be(size);
        done();
      });
    });
  });

  it('remove', function (done) {
    co(function *() {
      yield client.remove('/eventproxy/-/eventproxy-0.3.1.tgz');
      try {
        yield client.download('/eventproxy/-/eventproxy-0.3.1.tgz', download, {});
      } catch (err) {
        expect(err).to.be.ok();
        expect(err.code).to.be(404);
      }
    })(done);
  });
});
