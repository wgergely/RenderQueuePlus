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
          return dir.fsName;
        } else {
          return Folder.desktop.fsName;
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
          cls.basepath + sep +
          DEFAULT_BASE
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
        var s = cls.basepath + sep +
        DEFAULT_BASE + sep +
        cls.compname + sep +
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
        var s = cls.getPath() + sep + cls.getProjectName();
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
