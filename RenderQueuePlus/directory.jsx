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


/**
 * Wrapper module for window's dir command.
 */
var Directory = function(inPath) {
  var cls = function(inPath) {
    var pathFile = new File(inPath);

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

    this.getFiles = function(mask) {
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

    this.getFolders = function() {
      var args;
      if (File.fs === 'Windows') {
        args = '/o:n /a:d-h';
      }
      return this.callSystem(pathFile.fsName, args);
    };

    this.getHiddenFiles = function() {
      if (File.fs === 'Windows') {
        args = '/o:n /a:h-d';
      }

      return this.callSystem(pathFile.fsName, args);
    };

    this.getHiddenFolders = function() {
      var args = '/o:n /a:hd';
      return this.callSystem(pathFile.fsName, args);
    };

    this.getHidden = function() {
      var args = '/o:n /a:h';
      return this.callSystem(pathFile.fsName, args);
    };
  };

  cls.prototype = {
    callSystem: function(inPath, args) {
      var re = /(?:\.([^.]+))?$/;
      var extension = re.exec(inPath)[1];

      var cmd;
      var stats = {};
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
          catchError(e);
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

            var stats = {};
            var s;
            var d;
            var t;
            var z;
            var n;

            if (raw) {
              for (var i = 0; i < raw.length; i++) {
                s = raw[i].replace(/[,]/gim, '');
                s = s.match(/((\S+))/gim);

                d = String(s.shift());
                t = String(s.shift());
                z = parseInt(s.shift(), 10);
                n = String(s.join(' '));

                stats[n] = {
                  index: i,
                  date: d,
                  time: t,
                  size: z,
                  name: n,
                };
              }
              return stats;
            } else {
              stats['Error.'] = {
                index: 0,
                date: 'n/a',
                time: 'n/a',
                size: 'n/a',
                name: 'Error.',
              };
              return stats;
            }
          } else {
            stats['Invalid path.'] = {
              index: 0,
              date: 'n/a',
              time: 'n/a',
              size: 'n/a',
              name: 'Invalid path.',
            };
            return stats;
          }
        } catch (e) {
          stats['Error.'] = {
            index: 0,
            date: 'n/a',
            time: 'n/a',
            size: 'n/a',
            name: 'Error.',
          };
          return stats;
        }
      }
    },
  };
  return cls;
}();
