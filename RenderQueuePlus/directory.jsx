/**
 * Wrapper module for window's dir command.
 */
var Directory = (function(inPath) {
  var nextId = 1;

  var cls = function(inPath) {
    var id = nextId++;
    var pathFile = new File(inPath);

    this.getID = function() {
      return id;
    };

    this.changePath = function(inPath) {
      pathFile.changePath(inPath);
    };

    this.all = function() {
      var args;
      if (File.fs === 'Windows') {
        args = '/o:n';
      }
      return this.callSystem(pathFile.fsName, args);
    };

    this.files = function(mask) {
      var args;
      if (File.fs === 'Windows') {
        args = '/o:n /a:-d-h';
        if (mask) {
          return this.callSystem(pathFile.fsName + '\\' + mask, args);
        } else {
          return this.callSystem(pathFile.fsName, args);
        }
      }
    };

    this.folders = function() {
      var args;
      if (File.fs === 'Windows') {
        args = '/o:n /a:d-h';
      }
      return this.callSystem(pathFile.fsName, args);
    };

    this.hiddenFiles = function() {
      if (File.fs === 'Windows') {
        args = '/o:n /a:h-d';
      }

      return this.callSystem(pathFile.fsName, args);
    };

    this.hiddenFolders = function() {
      var args = '/o:n /a:hd';
      return this.callSystem(pathFile.fsName, args);
    };

    this.hidden = function() {
      var args = '/o:n /a:h';
      return this.callSystem(pathFile.fsName, args);
    };
  };

  cls.get_nextId = function() {
    return nextId;
  };

  cls.prototype = {
    callSystem: function(inPath, args) {
      var re = /(?:\.([^.]+))?$/;
      var extension = re.exec(inPath)[1];

      var returnObject = function(inArr) {
        var returnObj = {};
        returnObj.items = inArr;
        returnObj.item = function(index) {
          return inArr[index];
        };
        returnObj.count = inArr.length;
        returnObj.names = (function() {
          var returnArr = [];
          for (var i = 0; i < inArr.length; i++) {
            returnArr.push(inArr[i].name);
          }
          return returnArr;
        })();
        returnObj.dates = (function() {
          var returnArr = [];
          for (var i = 0; i < inArr.length; i++) {
            returnArr.push(inArr[i].date);
          }
          return returnArr;
        })();
        returnObj.times = (function() {
          var returnArr = [];
          for (var i = 0; i < inArr.length; i++) {
            returnArr.push(inArr[i].time);
          }
          return returnArr;
        })();
        returnObj.sizes = (function() {
          var returnArr = [];
          for (var i = 0; i < inArr.length; i++) {
            returnArr.push(inArr[i].size);
          }
          return returnArr;
        })();
        return returnObj;
      };

      var cmd;
      var stat = {};
      var stats = [];
      var error1;
      var error2;
      var error3;
      var error4;

      if (File.fs === 'Windows') {
        var tempOutput = new File(
          Folder.temp.fsName + '/' + 'RenderQueueTempOutput'
        );

        cmd = 'cmd /c "' +
        'dir ' + '\"' + inPath + '\"' + ' ' + args + '>"' +
        tempOutput.fsName + '""';

        try {
          system.callSystem(cmd);
        } catch (e) {
          Window.alert(e, SCRIPT_NAME);
          return null;
        };

        try {
          tempOutput.open('r');
          var raw = tempOutput.read();
          tempOutput.close();

          error1 = raw.indexOf('The system cannot find the file specified.');
          error2 = raw.indexOf(
            'Logon failure: unknown user name or bad password.'
          );
          error3 = raw.indexOf('The system cannot find the path specified.');
          error4 = raw.indexOf('File Not Found');

          if ((error1 < 0) && (error2 < 0) && (error3 < 0) && (error4 < 0)) {
            re = new RegExp('^.*(\.' + extension + ').*$', 'igm');
            raw = raw.match(re);

            var stats = [];
            var stat = {};
            var s;

            if (raw) {
              for (var i = 0; i < raw.length; i++) {
                s = raw[i].replace(/[,]/gim, '');
                s = s.match(/((\S+))/gim);
                stat = {
                  date: String(s.shift()),
                  time: String(s.shift()),
                  size: parseInt(s.shift(), 10),
                  name: String(s.join(' ')),
                };
                stats.push(stat);
              }
              return returnObject(stats);
            } else {
              stat = {
                date: 'n/a',
                time: 'n/a',
                size: 'n/a',
                name: 'Error.',
                raw: raw,
              };
              stats.push(stat);
              return returnObject(stats);
            }
          } else {
            stat = {
              date: 'n/a',
              time: 'n/a',
              size: 0,
              name: 'Invalid path.',
              raw: raw,
            };
            stats = [];
            stats.push(stat);
            return returnObject(stats);
          }
        } catch (e) {
          Window.alert(e, SCRIPT_NAME);
          stat = {
            date: 'n/a',
            time: 'n/a',
            size: 'n/a',
            name: 'Error.',
            raw: raw,
          };
          stats = [];
          stats.push(stat);
          return returnObject(stats);
        }
      }
    },
  };
  return cls;
}());
