var passStream = require('pass-stream'),
  db = require('./db'),
  audit;

module.exports = {

  /**
   * Tests the given request to determine if this proxy should be applied.
   * 
   * @name filter(req)
   * @param req The http request object to test
   * @api public
   */
  filter: function(req) {
    return req.url.indexOf(db.name) === 0 
        && ['PUT','POST','DELETE'].indexOf(req.method) !== -1
  },

  /**
   * Audits the request before proxying it on to the target.
   * 
   * @name onMatch(proxy, req, res, target)
   * @param proxy The proxy itself
   * @param res The http request object
   * @param req The http response object
   * @param target The target url to proxy the request on to
   * @api public
   */
  onMatch: function(proxy, req, res, target) {
    audit = audit || require('couchdb-audit').withNode(db, db.user);
    var dataBuffer = '';

    function writeFn(data, encoding, cb) {
      // do not push data until audited
      dataBuffer += data;
      cb();
    }

    function endFn(cb) {
      var self = this;
      var doc = JSON.parse(dataBuffer);
      audit.log([doc], function(err) {
        if (!err) {
          self.push(JSON.stringify(doc));
        }
        cb(err);
      });
    }

    var ps = passStream(writeFn, endFn);
    var buffer = req.pipe(ps);
    buffer.destroy = function(){};

    proxy.web(req, res, {
      target: target, 
      buffer: buffer,
      omitHeaders: ['content-length']
    });
  },

  /**
   * Exposed for testing
   */
  setup: function(deps) {
    passStream = deps.passStream;
    db = deps.db;
    audit = deps.audit;
  }

}