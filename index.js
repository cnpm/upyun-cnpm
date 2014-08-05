'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');

var Storage = require('co-upyun-storage');

var Upyun = function (options) {
  if (!options || !options.oprator || !options.password || !options.bucket) {
    throw new Error('need options.oprator and options.password and options.bucket');
  }
  this.client = Storage.create(options.oprator, options.password, options.bucket);
};

Upyun.prototype.url = function (key) {
  return 'http://' + this.client.bucket + '.b0.upaiyun.com' + key;
};

Upyun.prototype.upload = function* (filePath, options) {
  yield this.client.putFile(filePath, options.key);
  return { url: this.url(options.key) };
};
Upyun.prototype.uploadBuffer = function *(buf, options) {
  yield this.client.putBuffer(buf, options.key);
  return { url: this.url(options.key) };
};

Upyun.prototype.download = function* (key, filepath, options) {
  var writeStream = fs.createWriteStream(filepath);
  yield this.client.pipe(key, writeStream);
};

Upyun.prototype.remove = function* (key) {
  yield this.client.deleteFile(key);
};

exports.create = function (options) {
  return new Upyun(options);
};
