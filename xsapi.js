// Generated by CoffeeScript 1.6.2
(function() {
  "use strict";  window.xsapi = (function() {
    var _connect, _getResult, _responseHandler, _serializeError, _serializeSession, _serializeUrl, _xmlrpc,
      _this = this;

    function xsapi(username, password, hosturl) {
      this.username = username;
      this.password = password;
      this.hosturl = _serializeUrl(hosturl);
    }

    _connect = function(username, password, hostUrl, callback) {
      return _xmlrpc(hostUrl, "session.login_with_password", [username, password], callback);
    };

    _getResult = function(result, element) {
      return result[0][element];
    };

    _serializeSession = function(session) {
      return session.replace(/"/g, "");
    };

    _serializeUrl = function(url) {
      return "http://" + url + "/json";
    };

    _serializeError = function(error) {
      var e, str, _i, _len;

      str = 'Error: ';
      for (_i = 0, _len = error.length; _i < _len; _i++) {
        e = error[_i];
        str += e + ' ';
      }
      return str;
    };

    _responseHandler = function(status, response, callback) {
      var error, messageStatus, ret;

      if (status === "success") {
        messageStatus = _getResult(response, 'Status');
        if (messageStatus === "Success") {
          ret = _getResult(response, 'Value');
          return callback(null, ret);
        } else {
          error = _serializeError(_getResult(response, 'ErrorDescription'));
          return callback(error);
        }
      } else {
        error = "Failed to connect to specified host.";
        return callback(error);
      }
    };

    _xmlrpc = function(url, method, params, callback) {
      if (params == null) {
        params = "[]";
      }
      return $.xmlrpc({
        url: url,
        methodName: method,
        params: params,
        success: function(response, status, jqXHR) {
          return _responseHandler(status, response, callback);
        },
        error: function(jqXHR, status, error) {
          return _responseHandler(status, error, callback);
        }
      });
    };

    xsapi.prototype.getServerCall = function(method, callback, session) {
      var hosturl, main, tmpSession;

      if ((this.username != null) && (this.password != null) && (this.hosturl != null)) {
        hosturl = this.hosturl;
        if (session != null) {
          tmpSession = session;
          main(callback);
        } else {
          _connect(this.username, this.password, hosturl, function(err, res) {
            if (err) {
              return callback(err);
            } else {
              tmpSession = res;
              return main(callback);
            }
          });
        }
        return main = function(callback) {
          var params;

          params = [];
          session = _serializeSession(tmpSession);
          params.push(session);
          return _xmlrpc(hosturl, method, params, callback);
        };
      } else {
        return callback('Error: No settings found, make sure you initiate the class first.');
      }
    };

    xsapi.prototype.getServerVersion = function(callback) {
      if ((this.username != null) && (this.password != null) && (this.hosturl != null)) {
        return this.getServerCall("pool.get_all_records", callback);
      } else {
        return callback('Error: No settings found, make sure you initiate the class first.');
      }
    };

    return xsapi;

  }).call(this);

}).call(this);
