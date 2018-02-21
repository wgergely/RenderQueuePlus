var Taskmanager = function() {
  var re1 = /(.*aerender.exe.*)/gim;
  var re2 = /(.*afterfx.com.*)/gim;

  var cls = function() {
    this.data = function() {
        if (File.fs === 'Windows') {
            var data = system.callSystem('tasklist');
            if (data.length > 0) {
                return data;
            }
        }
    }();
    this.status = false;
  };

  cls.prototype = {
    isActive: function() {
      if (re1.test(this.data) || re2.test(this.data)) {
        this.status = true;
      } else if (!(re1.test(this.data)) && !(re2.test(this.data))) {
        this.status = false;
      }
      return this.status;
    },

    getNames: function() {
      var names = [];
      var items;
      var item;
      var i = 0;

      if (re1.test(this.data)) {
        items = this.data.match(re1);
        for (i = 0; i < items.length; i++) {
          item = items[i];
          item = item.replace(/\s+/gi, ',');
          names.push(item.split(',')[0]);
        }
      } else if (re2.test(this.data)) {
        items = this.data.match(re2);
        for (i = 0; i < items.length; i++) {
          item = items[i];
          item = item.replace(/\s+/gi, ',');
          names.push(item.split(',')[0]);
        }
      }
      return names;
    },

    getPIDs: function() {
      var PIDs = [];
      var items;
      var item;
      var i = 0;

      if (re1.test(this.data)) {
        items = this.data.match(re1);
        for (i = 0; i < items.length; i++) {
          item = items[i];
          item = item.replace(/\s+/gi, ',');
          PIDs.push(item.split(',')[1]);
        }
      } else if (re2.test(this.data)) {
        items = this.data.match(re2);
        for (i = 0; i < items.length; i++) {
          item = items[i];
          item = item.replace(/\s+/gi, ',');
          PIDs.push(item.split(',')[1]);
        }
      }
      return PIDs;
    },

    validate: function(PID) {
        var cmd = 'tasklist /fi "pid eq ' + PID + '" ';
        var call = system.callSystem(cmd);

        if (re1.test(call)) {
            return true;
        } else if (re2.test(call)) {
            return true;
        } else {
            return false;
        }
    },

    kill: function(PID) {
        var cmd = 'taskkill /f /t /pid ';
        if (this.validate(PID)) {
            var call = system.callSystem(cmd + PID);
            return call;
        }
    },
  };
  return cls;
}();
