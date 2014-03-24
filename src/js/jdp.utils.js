jdp.u = {
  override: function (object, config) {
    if (arguments.length === 1) {
      config = object;
      object = this;
    }
    if (!object || !config || typeof config !== 'object') {
      return object;
    }

    for (var property in object) {
      if (config.hasOwnProperty(property)) {
        object[property] = config[property];
      }
    }
    return object;
  },
  extend: function (object, config) {
    if (arguments.length === 1) {
      config = object;
      object = this;
    }
    if (!object || !config || typeof config !== 'object') {
      return object;
    }

    for (var property in config) {
      object[property] = config[property];
    }
    return object;
  },
  isNullOrEmpty: function (value) {
    return ((typeof (value) === 'undefined') || (value === null) || (value === ''));
  },
  StringBuilder: function (initialText) {
    var me = this;
    me._parts = jdp.u.isNullOrEmpty(initialText) ? [] : [initialText.toString()];
    me._value = {};
    me._len = 0;

    me.clear = function () {
      this._parts = [];
      this._value = {};
      this._len = 0;
    };
    me.append = function (text) {
      me._parts[me._parts.length] = text;
    };
    me.appendLine = function (text) {
      me.append(jdp.u.isNullOrEmpty(text) ? '\r\n' : text + '\r\n');
    };
    me.toString = function (separator) {
      separator = separator || '';
      var parts = this._parts;
      if (this._len !== parts.length) {
        this._value = {};
        this._len = parts.length;
      }
      var val = this._value;
      if (typeof (val[separator]) === 'undefined') {
        if (separator !== '') {
          for (var i = 0; i < parts.length;) {
            if ((typeof (parts[i]) === 'undefined') || (parts[i] === '') || (parts[i] === null)) {
              parts.splice(i, 1);
            } else {
              i++;
            }
          }
        }
        val[separator] = this._parts.join(separator);
      }
      return val[separator];
    };
  },
  getWindowSize: function() {
    return [
      window.innerWidth || (document.documentElement ? document.documentElement.clientWidth : 0) || (document.getElementsByTagName('body')[0] ? document.getElementsByTagName('body')[0].clientWidth : 0),
      window.innerHeight || (document.documentElement ? document.documentElement.clientHeight : 0) || (document.getElementsByTagName('body')[0] ? document.getElementsByTagName('body')[0].clientHeight : 0)
    ];
  }
};