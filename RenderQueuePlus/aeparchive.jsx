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


var Aeparchives = function() {
  var DEFAULT_BASE = '.aeparchive';

  /**
   * Saves and retrieves the archived aep compositions.
   * @param  {string} a The base path of the renders folder.
   * @param  {string} b The name of the comp.
   * @param  {string} c The current version-string.
   */
  var cls = function(a, b, c) {
    var cls = this;

    this.basepath = function() {
      try {
        var dir = new Folder(a);
        if (dir.exists) {
          return dir.absoluteURI;
        } else {
          return Folder.desktop.absoluteURI;
        }
      } catch (e) {
        catchError(e);
      }
    }(this);

    this.compname = b;

    this.version = c;

    this.versions = function() {
      try {
        var arr = [];
        var dir = new Folder(
          cls.basepath + '/' + DEFAULT_BASE
        );

        var files = dir.getFiles();
        for (var i = 0; i < files.length; i++) {
          if (files[i] instanceof Folder) {
            arr.push(files[i]);
          };
        }
        return arr;
      } catch (e) {
        catchError(e);
      }
    }();

    this.getPath = function() {
      try {
        var s = cls.basepath + '/' +
        DEFAULT_BASE + '/' +
        cls.compname + '/' +
        cls.version;
        return s;
      } catch (e) {
        catchError(e);
      }
    };

    this.createDir = function() {
      try {
        var dir = new Folder(cls.getPath());
        dir.create();
        return dir;
      } catch (e) {
        catchError(e);
      }
    };

    this.getProjectName = function() {
      try {
        var s ='[' + cls.compname + ']' +
        '[' + cls.version + ']';
        return s;
      } catch (e) {
        catchError(e);
      }
    };

    this.getArchivePath = function() {
      try {
        var s = cls.getPath() + '/' + cls.getProjectName();
        return s;
      } catch (e) {
        catchError(e);
      }
    };

    this.archive = function() {
      try {
        var target = new File(cls.getArchivePath());
        var c = app.project.file.copy(target.absoluteURI);
        if (!c) {
          Window.alert('Error archiving project', SCRIPT_NAME);
        }
      } catch (e) {
        catchError(e);
      };
    };
  };


  cls.prototype = {
    root: DEFAULT_BASE,
  };

  return cls;
  }();
