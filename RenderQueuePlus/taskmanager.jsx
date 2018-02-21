/*
MIT License

Copyright (c) 2018 Gergely Wootsch
hello@gergely-wootsch.com
http://gergely-wotsch.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


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
