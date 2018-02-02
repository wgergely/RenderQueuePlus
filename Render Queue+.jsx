var scriptFile = new File($.fileName);

(function(thisObj) {
  var settingsPalette;


  var sep = (function() {
    if (File.fs === 'Windows') {
      return '\\';
    }
  }());

  /**
   * After Effects helper script: returns the number of leading zeros
   * @param  {string} n string to extrapolate the padding from
   * @return {integer}   the number of leading zeros
   */
  function getPadding(n) {
    var e = decodeURI(n).match(
      /\[#\]|\[##\]|\[###\]|\[####\]|\[#####\]|\[######\]/g
    );
    return e ? e[0].length - 2 : null;
  }

  /**
   * Return the version number from the given string
   * eg 'v001'
   * @param  {string} inString string containing the version
   * @return {number}          the version number
   */
  function getVersionNumberFromString(inString) {
    var match = inString.match(/(v\d\d\d)/ig);
    if (match) {
      return parseInt(match[0].slice(1), 10);
    }
    return null;
  }

  /**
   * Adds n number of leading zeros to a given number
   * @param  {integer} a the number to pad
   * @param  {integer} b number of leading zeros
   * @return {string}   the padded number
   */
  function pad(a, b) {
    for (var c = a + ''; c.length < b;) c = '0' + c;
    return c;
  }

  /**
   * Returns an array from a given range string
   * eg. '1-250' results in [1,2,3,..,250]
   * http://stackoverflow.com/questions/2270910/how-to-convert-sequence-of-numbers-in-an-array-to-range-of-numbers
   * @param  {[type]} array [description]
   * @return {[type]}       [description]
   */
  function getRanges(array) {
    var ranges = [];
    var rstart;
    var rend;
    for (var i = 0; i < array.length; i++) {
      rstart = array[i];
      rend = rstart;
      while (array[i + 1] - array[i] == 1) {
        rend = array[i + 1]; // increment the index if the numbers sequential
        i++;
      }
      ranges.push(rstart == rend ? rstart+'' : rstart + '-' + rend);
    }
    return ranges;
  };

  /**
   * Clips strings to a number of characters
   * @param  {string}  inString The text to clip
   * @return {string}          Clipped text
   */
  function ellipsis(inString) {
    if (inString) {
      if (inString.length > 100) {
        var head = inString.substr(0, 0);
        var dots = '...';
        var tail = inString.substr(inString.length - 100, inString.length);
        return head + dots + tail;
      }
      return inString;
    } else {
      return '-';
    }
  };

  /**
   * Formats a byte into a human readable string, eg 1024 -> '1KB'
   * http://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
   * @param  {number} a bytes
   * @param  {number} b decimals
   * @return {string}   formatted text
   */
  function formatBytes(a, b) {
    if (0 === a) return '0 Byte';
    var c = 1024;
      d = b + 1 || 3,
      e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      f = Math.floor(Math.log(a) / Math.log(c));
    return (a / Math.pow(c, f)).toPrecision(d) + ' ' + e[f];
  };

  /**
   * Array.indexOf Polyfill
   *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
   * @param  {[type]} a [description]
   * @param  {[type]} b [description]
   * @return {[type]}   [description]
   */
  Array.prototype.indexOf || (Array.prototype.indexOf = function(a, b) {
    var c;
    if (null === this) throw new TypeError('"this" is null or not defined');
    var d = Object(this);
    var e = d.length >>> 0;
    if (0 === e) return -1;
    var f = +b || 0;
    if (Math.abs(f) === 1 / 0 && (f = 0), f >= e) return -1;
    for (c = Math.max(f >= 0 ? f : e - Math.abs(f), 0); e > c;) {
      if (c in d && d[c] === a) return c;
      c++;
    }
    return -1;
  });

  /**
   * Imports a given fottage item to the project.
   * Create a 'prerenders' folder with 'comp' and 'verion' subfolders.
   * @param  {[type]} inPath   [description]
   * @param  {[type]} sequence [description]
   * @param  {[type]} compName [description]
   * @param  {[type]} version  [description]
   */
  function importFootage(inPath, sequence, compName, version) {
    var IO = new ImportOptions();
    IO.file = new File(inPath);
    IO.sequence = sequence;

    if (IO.canImportAs(ImportAsType.FOOTAGE)) {
      IO.importAs = ImportAsType.FOOTAGE;
    }

    var item = app.project.importFile(IO);

    var rExists = false;
    var cExists = false;
    var vExists = false;
    var r;
    var c;
    var v;

    var i = app.project.rootFolder.items.length;
    var folderItem;

    while (i--) {
      folderItem = app.project.rootFolder.item(i);
      if (
        (folderItem instanceof FolderItem) &&
        (folderItem.name === 'prerenders')
      ) {
        rExists = true;
        r = item;
        break;
      }
    }

    if (!rExists) {
      r = app.project.items.addFolder('prerenders');
      r.parentFolder = app.project.rootFolder;
    }

    for (i = 1; i <= r.items.length; i++) {
      if (r.item(i).name === compName) {
        cExists = true;
        c = r.item(i);
        break;
      }
    }

    if (!cExists) {
      c = app.project.items.addFolder(compName);
      c.parentFolder = r;
    }

    for (i = 1; i <= c.items.length; i++) {
      if (c.item(i).name === version) {
        vExists = true;
        v = c.item(i);
        break;
      }
    }

    if (!vExists) {
      v = app.project.items.addFolder(version);
      v.parentFolder = c;
    }

    for (i = 1; i <= v.items.length; i++) {
      if (v.item(i).name === item.name) {
        Window.alert(
          'Footage already exists in the project.',
          'Render Queue+',
          undefined
        );
        item.remove();
        item = v.item(i);
        break;
      }
    }

    item.parentFolder = v;
  }

  /**
   * [Displays a popup dialog with editable text contents
   * @param  {string} title Title of the dialog
   * @param  {string} input Dialog contents
   */
  function alert_scroll(title, input) {
    var w = new Window('dialog', title);
    var list = w.add('edittext', undefined, input, {
      multiline: true,
      scrolling: true,
    });
    list.maximumSize.height = w.maximumSize.height - 100;
    list.minimumSize.width = 550;
    w.add('button', undefined, 'Close', {
      name: 'ok',
    });
    list.size = [850, 500];
    w.show();
  }

  // Script globals
  var pathcontrol;

  var Settings = function(thisObj) {
      /**
       * Returns the path for aerender
       * @param  {string} version After Effects version, eg. 'CC 2018'
       * @return {string}         the path for aerender.exe
       */
      function getAerenderPath(version) {
        var path = 'C:\\Program Files\\Adobe\\';
        path += 'Adobe After Effects <version>\\Support Files\\aerender.exe';
        path = path.replace('<version>', version);
        return path;
      }

      var AE_RENDER_PATHS = {
        'CC 2020': getAerenderPath('CC 2020'),
        'CC 2019': getAerenderPath('CC 2019'),
        'CC 2018': getAerenderPath('CC 2018'),
        'CC 2017': getAerenderPath('CC 2017'),
        'CC 2015.3': getAerenderPath('CC 2015.3'),
        'CC 2015': getAerenderPath('CC 2015'),
        'CC 2014': getAerenderPath('CC 2014'),
        'CC': getAerenderPath('CC'),
        'CS6': getAerenderPath('CS6'),
      };

      var settings = {};

      settings.lastmodified = '29/01/2018';
      settings.version = '0.1.15';
      settings.name = settings.scriptname;
      settings.author = 'Gergely Wootsch';
      settings.email = 'hello@gergely-wootsch.com';
      settings.website = 'http://gergely-wootsch.com';
      settings.description = '';
      settings.help = '';

      settings.scriptname = 'Render Queue+';

      settings.platform = File.fs;
      settings.version = parseFloat(app.version);
      settings.tempFolder = new Folder(
        Folder.temp.fullName + '/' + settings.scriptname
      );
      settings.tempPath = settings.tempFolder.fsName;

      settings.player = 'rv';

      settings.rv = {};
      settings.rv.rv_usepush = null;

      var rvHelpFile = new File(
        scriptFile.parent.absoluteURI + '/docs/rvHelp.txt'
      );
      rvHelpFile.open('r');
      settings.rv.rv_help = rvHelpFile.read();
      rvHelpFile.close();

      settings.rv.rv_bin = null;
      settings.rv.rvpush_bin = null;
      settings.rv.rv_call = null;
      settings.rv.rvpush_call = null;

      settings.djv = {};

      var djvHelpFile = new File(
        scriptFile.parent.absoluteURI + '/docs/djvHelp.txt'
      );
      djvHelpFile.open('r');
      settings.djv.djv_help = djvHelpFile.read();
      djvHelpFile.close();

      settings.djv.djv_bin = null;
      settings.djv.djv_call = null;

      settings.aerender = {};
      settings.aerender.aerender_bin = null;
      settings.aerender.aerender_serverroot = null;
      settings.aerender.instances = null;
      settings.aerender.dialog = null;

      settings.pathcontrol = {};
      settings.pathcontrol.pathcontrol_help = '';
      settings.pathcontrol.basepattern = '';
      settings.pathcontrol.fsName = '';

    /**
     * Set rv.exe path
     */
    function pickRVButton_onClick() {
      var file = new File('/');
      file = file.openDlg(
        'Where is  \'rv.exe\' located?',
        'Windows exe files:*.exe'
      );

      settings.rv.rv_bin = file.fsName;
      setSetting('rv_bin', settings.rv.rv_bin);

      setUIString('rvPickString', 'File Set: \'' + getSetting('rv_bin') + '\'');
    }

    /**
     * Set rvpush.exe path
     */
    function pickRVPushButton_onClick() {
      var file = new File('/');
      file = file.openDlg(
        'Where is \'rvpush.exe\' located?',
        'Windows exe files:*.exe'
      );

      settings.rv.rvpush_bin = file.fsName;
      setSetting('rvpush_bin', settings.rv.rvpush_bin);

      setUIString(
        'rvpushPickString',
        'File Set: \'' + getSetting('rvpush_bin') + '\''
      );
    }

    /**
     * Set DJView path
     */
    function pickDJVPushButton_onClick() {
      var file = new File('/');
      file = file.openDlg(
        'Where is \'djv_view.exe\' located?',
        'Windows exe files:*.exe'
      );

      settings.djv.djv_bin = file.fsName;
      setSetting('djv_bin', settings.djv.djv_bin);

      setUIString(
        'djvPickString',
        'File Set: \'' + getSetting('djv_bin') + '\''
      );
    }

    /**
     * [rvCheckbox_onClick description]
     */
    function rvCheckbox_onClick() {
      settingsPalette.findElement('djvPanel').enabled = !this.value;
      settingsPalette.findElement('rvPanel').enabled = this.value;
      settingsPalette.findElement('djvCheckbox').value = !this.value;

      if (this.value) {
        settings.player = 'rv';
      } else {
        settings.player = 'djv';
      }

      app.settings.saveSetting(settings.scriptname, 'player', settings.player);
    }

    /**
     * Set rvpush as player
     */
    function rvPushCheckbox_onClick() {
      settings.rv.rv_usepush = this.value;
      setSetting('rv_usepush', settings.rv.rv_usepush);
    }

    /**
     * Set djview as viewer
     */
    function djvCheckbox_onClick() {
      settingsPalette.findElement('rvPanel').enabled = !this.value;
      settingsPalette.findElement('djvPanel').enabled = this.value;
      settingsPalette.findElement('rvCheckbox').value = !this.value;

      if (this.value) {
        settings.player = 'djv';
      } else {
        settings.player = 'rv';
      }

      app.settings.saveSetting(settings.scriptname, 'player', settings.player);
    }

    /**
     * Show rv help
     */
    function rvHelpButton_onClick() {
      alert_scroll('Help: RV Command Line Switches', settings.rv.rv_help);
    }

    /**
     * Show djv help
     */
    function djvHelpButton_onClick() {
      alert_scroll(
        'Help: DJV View Command Line Switches',
        settings.djv.djv_help
      );
    }

    /**
     * Sets the default root path for Path Control.
     */
    function pathcontrolPickButton_onClick() {
      var folder = new Folder(settings.pathcontrol.fsName);
      folder = folder.selectDlg('Select new render folder location');

      if (folder) {
        basepath = folder.fsName;
        settings.pathcontrol.fsName = folder.fsName;
        settings.pathcontrol.basepattern = settings.pathcontrol.fsName;

        setSetting('pathcontrol_fsName', settings.pathcontrol.fsName);
        setSetting('pathcontrol_basepattern', settings.pathcontrol.fsName);
        setUIString('pathcontrol_fsName', settings.pathcontrol.fsName);
        setUIString('pathcontrol_basepattern', settings.pathcontrol.fsName);
      }
    }

    /**
     * Reveals the currently set root path Control root folder.
     */
    function pathcontrolExploreButton_onClick() {
      var folder = new Folder(settings.pathcontrol.fsName);
      if (folder.exists) {
        folder.execute();
      } else {
        if (folder.parent.exists) {
          folder.parent.execute();
        } else {
          if (folder.parent.parent.exists) {
            folder.parent.parent.execute();
          }
        }
      }
    }

    /**
     * Saves the custom rv call string
     */
    function rvCallString_onChanged() {
      settings.rv.rv_call = this.text;
      app.settings.saveSetting(
        settings.scriptname,
        'rv_call',
        settings.rv.rv_call
      );
    }

    /**
     * Saves the custom djvew call string
     */
    function djvCallString_onChanged() {
      settings.djv.djv_call = this.text;
      app.settings.saveSetting(
        settings.scriptname,
        'djv_call',
        settings.djv.djv_call
      );
    }

    /**
     * Expands the input patter and sets it as a new base path.
     */
    function pathcontrol_basepattern_onChanged() {
      settings.pathcontrol.basepattern = this.text;
      setSetting('pathcontrol_basepattern', this.text);
      setBasebath();

      var folder = new Folder(settings.pathcontrol.fsName);

      if (!folder.exists) {
        if (folder.displayName.match(/tmp0000/)) {
          settings.pathcontrol.fsName = Folder.desktop.fsName;
          setSetting('pathcontrol_fsName', settings.pathcontrol.fsName);
        } else {
          var s = '\'' + folder.fsName + '\'' + ' doesn\'t exists.\n';
          s += 'Do you want to create it now?';
          var prompt = confirm(
            s,
            'New Render Location Set'
          );
          if (prompt) {
            folder.create();
          }
        }
      }
    }

    /**
     * Private convenience function to set an internal setting
     * @param {string} keyName settings dictinary key
     * @param {object} value   the setting value
     * @return {object}        the set value
     */
    function setSetting(keyName, value) {
      var s = app.settings;
      s.saveSetting(settings.scriptname, keyName, value);
      return s.getSetting(settings.scriptname, keyName);
    };

    /**
     * Private convenience function to get an internal setting
     * @param  {string} keyName settings dictinary key
     * @return {object}         value of the setting
     */
    function getSetting(keyName) {
      var s = app.settings;
      if (s.haveSetting(settings.scriptname, keyName)) {
        return s.getSetting(settings.scriptname, keyName);
      } else {
        return null;
      }
    };

    /**
     * Sets the text for the given ui element
     * @param {string} inName name of the ui element
     * @param {string} inText text to display
     */
    function setUIString(inName, inText) {
      settingsPalette.findElement(inName).text = inText;
    };

    /**
     * Sets the basepath
     */
    function setBasebath() {
      var saved = true;
      var folder = new Folder('/');
      var errorString = 'Project is not saved. ';
      errorString += 'Unable to set path relative to project location.';

      try {
        saved = app.project.file.exists;
      } catch (e) {
        saved = false;
      }

      if (settings.pathcontrol.basepattern) {
        if (saved) {
          if (settings.pathcontrol.basepattern.match(/^\.\.\/|^\.\.\\/gi)) {
            settings.pathcontrol.fsName = (
              app.project.file.parent.parent.fsName +
              sep +
              settings.pathcontrol.basepattern.slice(3)
            ).replace(/\/\\/gi, sep).replace(/\/|\\/gi, sep);
          } else {
            if (settings.pathcontrol.basepattern.match(/^\.\/|^\.\\/gi)) {
              settings.pathcontrol.fsName = (
                app.project.file.parent.fsName +
                sep +
                settings.pathcontrol.basepattern.slice(2)
              ).replace(/\/|\\/gi, sep);
            } else {
              settings.pathcontrol.fsName = (
                settings.pathcontrol.basepattern
              ).replace(/\/|\\/gi, sep);
            }
          }
        } else {
          if (settings.pathcontrol.basepattern.match(/^\./gi)) {
            settings.pathcontrol.fsName = '';
          } else {
            settings.pathcontrol.fsName = (
              settings.pathcontrol.basepattern
            ).replace(/\/|\\/gi, sep);
          }
        }

        folder.changePath(settings.pathcontrol.fsName);
        setSetting('pathcontrol_fsName', folder.fsName);

        if (settings.pathcontrol.fsName === '') {
          folder.changePath('');
          settings.pathcontrol.fsName = Folder.desktop.fsName;
          setSetting('pathcontrol_fsName', settings.pathcontrol.fsName);
          setUIString('pathcontrol_fsName', errorString);
        } else {
          setUIString('pathcontrol_fsName', folder.fsName);
        }
      } else {
        folder.changePath('');
        settings.pathcontrol.fsName = Folder.desktop.fsName;
        setSetting('pathcontrol_fsName', settings.pathcontrol.fsName);
      }
      settings.pathcontrol.fsName = getSetting('pathcontrol_fsName');
    };

    // Set Settings from Saved Preferences
    settings.setSettings = function() {
      settings.player = getSetting('player');

      settings.rv.rv_bin = getSetting('rv_bin');
      settings.rv.rv_usepush = getSetting('rv_usepush');
      settings.rv.rvpush_bin = getSetting('rvpush_bin');
      settings.rv.rv_call = getSetting('rv_call');
      if (!settings.rv.rv_call) {
        settings.rv.rv_call = '';
        setSetting('rv_call', '');
      }

      settings.rv.rvpush_call = getSetting('rvpush_call');

      settings.djv.djv_bin = getSetting('djv_bin');
      settings.djv.djv_call = getSetting('djv_call');
      if (!settings.djv.djv_call) {
        settings.djv.djv_call = '';
        setSetting('djv_call', '');
      }

      settings.aerender.aerender_bin = function() {
        var version = parseFloat(app.version);
        var aerender = new File('/');
        var string;

        if (File.fs == 'Windows') {
          if (version >= 16 && version < 16.5) {
            aerender.changePath(AE_RENDER_PATHS['CC 2020']);
          } else if (version >= 15.5 && version < 16) {
            aerender.changePath(AE_RENDER_PATHS['CC 2019']);
          } else if (version >= 15 && version < 15.5) {
            aerender.changePath(AE_RENDER_PATHS['CC 2018']);
          } else if (version >= 14 && version < 14.3) {
            aerender.changePath(AE_RENDER_PATHS['CC 2017']);
          } else if (version >= 13.8 && version < 14) {
            aerender.changePath(AE_RENDER_PATHS['CC 2015.3']);
          } else if (version >= 13.5 && version < 13.8) {
            aerender.changePath(AE_RENDER_PATHS['CC 2015']);
          } else if (version >= 13 && version < 13.5) {
            aerender.changePath(AE_RENDER_PATHS['CC 2014']);
          } else if (version >= 12 && version < 12.3) {
            aerender.changePath(AE_RENDER_PATHS['CC']);
          } else if (version >= 11 && version < 11.1) {
            aerender.changePath(AE_RENDER_PATHS['CS6']);
          };
        }


        if (aerender.exists) {
          string = aerender.fsName;
        } else {
          var text = 'Aerender.exe cannot be found.\n';
          text += 'Do you want to manually select it?';
          var prompt = confirm(
            text,
            'aerender'
          );
          if (prompt) {
            aerender = aerender.openDlg(
              'Select the Location of aerender',
              'aerender.exe:aerender.exe'
            );
            if (aerender) {
              string = aerender.fsName;
            } else {
              string = null;
            };
          } else {
            string = null;
          }
        }
        setSetting('aerender_bin', string);
        return string;
      }();
      settings.aerender.aerender_serverroot = getSetting('aerender_serverroot');
      settings.aerender.aerender_instances = getSetting('aerender_instances');
      settings.aerender.aerender_dialog = getSetting('aerender_dialog');

      settings.pathcontrol.basepattern = getSetting('pathcontrol_basepattern');
      if (!settings.pathcontrol.basepattern) {
        settings.pathcontrol.basepattern = '';
        setSetting('pathcontrol_basepattern', '');
      }

      settings.pathcontrol.fsName = getSetting('pathcontrol_fsName');
    }();

    var cls = function() {
      var cls = this;

      this.settingsPalette = null;

      this.createUI = function(cls) {
        settingsPalette = thisObj instanceof Panel ? thisObj : new Window(
          'palette',
          settings.scriptname + ': Settings',
          undefined,
          {
            resizeable: false,
          }
        );

        if (settingsPalette === null) return;

        settingsPalette.margins = 20;
        settingsPalette.spacing = 20;

        var binGroup = settingsPalette.add(
          'group',
          undefined,
          {
            name: 'binGroup',
          }
        );
        binGroup.orientation = 'column';

        // ====================================================

        var pathcontrolPanel = binGroup.add(
          'panel',
          undefined,
          'Set Default Render Location',
          {
            borderstyle: 'gray',
            name: 'pathcontrolPanel',
          }
        );
        pathcontrolPanel.alignChildren = ['fill', 'fill'];

        var pathcontrol_basepatternGroup = pathcontrolPanel.add(
          'group',
          undefined,
          {
            name: 'pathcontrol_basepatternGroup',
          }
        );

        var pathcontrol_basepatternHeader = pathcontrol_basepatternGroup.add(
          'statictext',
          undefined,
          'Type/pick folder path:',
          {
            name: 'pathcontrol_basepatternHeader',
          }
        );
        pathcontrol_basepatternHeader.size = [150, 25];

        var pathcontrol_basepattern = pathcontrol_basepatternGroup.add(
          'edittext',
          undefined,
          '',
          {
            name: 'pathcontrol_basepattern',
          }
        );
        pathcontrol_basepattern.size = [290, 25];
        pathcontrol_basepattern.onChange = pathcontrol_basepattern_onChanged;
        pathcontrol_basepattern.onChanged = pathcontrol_basepattern_onChanged;

        var pathcontrolBrowseButton = pathcontrol_basepatternGroup.add(
          'button',
          undefined,
          'Reveal',
          {
            name: 'pathcontrolExploreButton',
          }
        );
        pathcontrolBrowseButton.size = [70, 25];
        pathcontrolBrowseButton.onClick = pathcontrolExploreButton_onClick;

        var pathcontrolHelpButton = pathcontrol_basepatternGroup.add(
          'button',
          undefined,
          'Pick New',
          {
            name: 'pathcontrolPickButton',
          }
        );
        pathcontrolHelpButton.size = [70, 25];
        pathcontrolHelpButton.onClick = pathcontrolPickButton_onClick;

        var pathcontrolResultGroup = pathcontrolPanel.add(
          'group',
          undefined,
          {
            name: 'pathcontrol_basepatternGroup',
          }
        );

        var pathcontrol_fsNameLabel = pathcontrolResultGroup.add(
          'statictext',
          undefined,
          'Use ./ or ../ to set a path relative to the active project.',
          {
            name: 'pathcontrol_fsNameLabel',
            multiline: true,
          }
        );
        pathcontrol_fsNameLabel.size = [150, 45];

        var pathcontrol_fsName = pathcontrolResultGroup.add(
          'statictext',
          undefined,
          'No pattern has been set.',
          {
            name: 'pathcontrol_fsName',
          }
        );
        pathcontrol_fsName.size = [450, 45];

        // ====================================================

        var rvPanel = binGroup.add(
          'panel',
          undefined,
          'RV',
          {
            borderStyle: 'gray',
            name: 'rvPanel',
          }
        );
        rvPanel.alignChildren = ['fill', 'fill'];

        var rvCheckboxGroup = rvPanel.add(
          'group',
          undefined,
          {
            name: 'rvCheckboxGroup',
          }
        );

        var rvCheckbox = rvCheckboxGroup.add(
          'checkbox',
          undefined,
          'Use RV for Playback',
          {
            name: 'rvCheckbox',
          }
        );
        rvCheckbox.onClick = rvCheckbox_onClick;

        var rvPushCheckbox = rvCheckboxGroup.add(
          'checkbox',
          undefined,
          'Use RV Push',
          {
            name: 'rvPushCheckbox',
          }
        );
        rvPushCheckbox.onClick = rvPushCheckbox_onClick;


        var rvCallStringGroup = rvPanel.add(
          'group',
          undefined,
          {
            name: 'rvCallStringGroup',
          }
        );
        rvCallStringGroup.orientation = 'row';

        var rvCallStringHeader = rvCallStringGroup.add(
          'statictext',
          undefined,
          'RV Custom Switches:',
          {
            name: 'rvCallStringHeader',
          }
        );
        rvCallStringHeader.size = [150, 25];

        var rvCallString = rvCallStringGroup.add(
          'edittext',
          undefined,
          '',
          {
            name: 'rvCallString',
          }
        );
        rvCallString.size = [290, 25];
        rvCallString.onChange = rvCallString.onChanged = rvCallString_onChanged;

        var rvHelpButton = rvCallStringGroup.add(
          'button',
          undefined,
          'RV Help',
          {
            name: 'rvHelpButton',
          }
        );
        rvHelpButton.size = [150, 25];
        rvHelpButton.onClick = rvHelpButton_onClick;

        var rvGroup = rvPanel.add(
          'group',
          undefined,
          {
            name: 'rvGroup',
          }
        );
        rvGroup.orientation = 'row';

        var pickRVButton = rvGroup.add(
          'button',
          undefined,
          'Set RV Path',
          {
            name: 'pickRVButton',
          }
        );
        pickRVButton.size = [150, 25];
        pickRVButton.onClick = pickRVButton_onClick;

        var rvPickString = rvGroup.add(
          'statictext',
          undefined,
          'path not set',
          {
            name: 'rvPickString',
          }
        );
        rvPickString.enabled = false;
        rvPickString.graphics.foregroundColor = rvPickString.graphics.newPen(
          settingsPalette.graphics.PenType.SOLID_COLOR,
          [0.7, 0.7, 0.7],
          1
        );
        rvPickString.alignment = 'right';
        rvPickString.size = [450, 25];


        var rvpushCallStringGroup = rvPanel.add(
          'group',
          undefined,
          {
            name: 'rvpushCallStringGroup',
          }
        );
        rvpushCallStringGroup.orientation = 'row';

        var rvpushCallStringHeader = rvpushCallStringGroup.add(
          'statictext',
          undefined,
          'RVPush Custom Switches:',
          {
            name: 'rvpushCallStringHeader',
          }
        );
        rvpushCallStringHeader.size = [150, 25];

        var rvpushCallString = rvpushCallStringGroup.add(
          'edittext',
          undefined,
          '',
          {
            name: 'rvpushCallString',
          }
        );
        rvpushCallString.size = [260, 25];


        var rvpushGroup = rvPanel.add(
          'group',
          undefined,
          {
            name: 'rvpushGroup',
          }
        );
        rvpushGroup.orientation = 'row';

        var pickRVPushButton = rvpushGroup.add(
          'button',
          undefined,
          'Set RVPush Path',
          {
            name: 'pickRVPushButton',
          }
        );
        pickRVPushButton.size = [150, 25];
        pickRVPushButton.onClick = pickRVPushButton_onClick;

        var rvpushPickString = rvpushGroup.add(
          'statictext',
          undefined,
          'path not set',
          {
            name: 'rvpushPickString',
          }
        );
        rvpushPickString.enabled = false;
        var pen = rvpushPickString.graphics.newPen(
          settingsPalette.graphics.PenType.SOLID_COLOR,
          [0.7, 0.7, 0.7],
          1
        );
        rvpushPickString.graphics.foregroundColor = pen;
        rvpushPickString.alignment = 'right';
        rvpushPickString.size = [450, 25];


        // ====================================================

        var djvPanel = binGroup.add(
          'panel',
          undefined,
          'DJV View',
          {
            borderStyle: 'gray',
            name: 'djvPanel',
          }
        );
        djvPanel.alignChildren = ['fill', 'fill'];


        var djvCheckboxGroup = djvPanel.add(
          'group',
          undefined,
          {
            name: 'djvCheckboxGroup',
          }
        );
        var djvCheckbox = djvCheckboxGroup.add(
          'checkbox',
          undefined,
          'Use DJV View for Playback',
          {
            name: 'djvCheckbox',
          }
        );
        djvCheckbox.onClick = djvCheckbox_onClick;

        var djvCallStringGroup = djvPanel.add(
          'group',
          undefined,
          {
            name: 'djvCallStringGroup',
          }
        );
        djvCallStringGroup.orientation = 'row';

        var djvCallStringHeader = djvCallStringGroup.add(
          'statictext',
          undefined,
          'DJV Custom Switches:',
          {
            name: 'djvCallStringHeader',
          }
        );
        djvCallStringHeader.size = [150, 25];

        var djvCallString = djvCallStringGroup.add(
          'edittext',
          undefined,
          '',
          {
            name: 'djvCallString',
          }
        );
        djvCallString.size = [290, 25];
        djvCallString.onChange = djvCallString_onChanged;
        djvCallString.onChanged = djvCallString_onChanged;

        var djvHelpButton = djvCallStringGroup.add(
          'button',
          undefined,
          'djv Help',
          {
            name: 'djvHelpButton',
          }
        );
        djvHelpButton.size = [150, 25];
        djvHelpButton.onClick = djvHelpButton_onClick;

        var djvGroup = djvPanel.add(
          'group',
          undefined,
          {
            name: 'djvGroup',
          }
        );
        djvGroup.orientation = 'row';

        var pickDJVButton = djvGroup.add(
          'button',
          undefined,
          'Set DJV Path',
          {
            name: 'pickDJVButton',
          }
        );
        pickDJVButton.size = [150, 25];
        pickDJVButton.onClick = pickDJVPushButton_onClick;

        var djvPickString = djvGroup.add(
          'statictext',
          undefined,
          'djv path not yet set',
          {
            name: 'djvPickString',
          }
        );

        djvPickString.graphics.foregroundColor = djvPickString.graphics.newPen(
          settingsPalette.graphics.PenType.SOLID_COLOR,
          [0.7, 0.7, 0.7],
          1
        );

        djvPickString.alignment = 'right';
        djvPickString.size = [450, 25];

        // ====================================================

        var closeBtn = settingsPalette.add(
          'button',
          undefined,
          'Close',
          {
            name: 'ok',
          }
        );
        closeBtn.onClick = function() {
          settingsPalette.hide();
        };
      }(cls);

      this.show = function() {
        if (settings.player == 'rv') {
          settingsPalette.findElement('djvPanel').enabled = false;
          settingsPalette.findElement('rvPanel').enabled = true;
          settingsPalette.findElement('rvCheckbox').value = true;
          settingsPalette.findElement('djvCheckbox').value = false;
        }
        if (settings.player == 'djv') {
          settingsPalette.findElement('djvPanel').enabled = true;
          settingsPalette.findElement('rvPanel').enabled = false;
          settingsPalette.findElement('rvCheckbox').value = false;
          settingsPalette.findElement('djvCheckbox').value = true;
        }

        if (!getSetting('rv_usepush')) {
          if (getSetting('rv_usepush') === 'true') {
            settingsPalette.findElement('rvPushCheckbox').value = true;
          } else {
            settingsPalette.findElement('rvPushCheckbox').value = false;
          }
        }

        if (!getSetting('rv_bin')) {
          setUIString('rvPickString', 'Path not set.');
        } else {
          setUIString(
            'rvPickString',
            '\'' + getSetting('rv_bin') + '\''
          );
        }

        if (!getSetting('rvpush_bin')) {
          setUIString(
            'rvpushPickString',
            'Path not set.'
          );
        } else {
          setUIString(
            'rvpushPickString',
            '\'' + getSetting('rvpush_bin') + '\''
          );
        }

        if (!getSetting('rv_call')) {
          setUIString('rvCallString', '');
        } else {
          setUIString('rvCallString', getSetting('rv_call'));
        }

        if (!getSetting('djv_bin')) {
          setUIString('djvPickString', 'Path not set.');
        } else {
          setUIString('djvPickString', '\'' + getSetting('djv_bin') + '\'');
        }

        if (!getSetting('djv_call')) {
          setUIString('djvCallString', '');
        } else {
          setUIString('djvCallString', getSetting('djv_call'));
        }

        if (!(getSetting('pathcontrol_basepattern') === '')) {
          setUIString(
            'pathcontrol_basepattern',
            getSetting('pathcontrol_basepattern')
          );
        } else {
          setUIString(
            'pathcontrol_basepattern',
            ''
          );
        }

        if (!(getSetting('pathcontrol_fsName') === '')) {
          setUIString('pathcontrol_fsName', getSetting('pathcontrol_fsName'));
        } else {
          setUIString('pathcontrol_fsName', 'No valid pattern has been set.');
        }

        settingsPalette.layout.layout(true);
        settingsPalette.layout.resize();
        if (!(settingsPalette instanceof Panel)) {
          settingsPalette.show();
        }
      };

      this.setSetting = function(inKeyValue, inValue) {
        app.settings.setSetting(sectionName);
      };

      this.getSetting = function(inKeyValue) {
        return getSetting(inKeyValue);
      };

      this.hasSettings = function(inKeyValue) {
        var value = app.settings.hasSettings(sectionName, inKeyValue);
        return value;
      };

      this.setbasepath = function() {
        setBasebath();
      };

      this.tempFolder = function() {
        settings.tempFolder.create();
        return settings.tempFolder;
      }();

      this.platform = function() {
        return settings.platform;
      }();

      this.version = function() {
        return settings.version;
      }();

      this.scriptname = function() {
        return settings.scriptname;
      }();
    };
    return cls;
  }(this);
  var settings = new Settings;

  settings.setbasepath();

  var MainWindow_StartRender = new File(
    scriptFile.parent.absoluteURI + '/icons/MainWindow_StartRender.png'
  );
  var MainWindow_SaveRender = new File(
    scriptFile.parent.absoluteURI + '/icons/MainWindow_SaveRender.png'
  );
  var redIcon = new File(
    scriptFile.parent.absoluteURI + '/icons/redIcon.png'
  );
  var orangeIcon = new File(
    scriptFile.parent.absoluteURI + '/icons/orangeIcon.png'
  );
  var greenIcon = new File(
    scriptFile.parent.absoluteURI + '/icons/greenIcon.png'
  );
  var grayIcon = new File(
    scriptFile.parent.absoluteURI + '/icons/grayIcon.png'
  );
  var redbinPNG = new File(
    scriptFile.parent.absoluteURI + '/icons/redbin.png'
  );
  var MainWindow_PlayIcon = new File(
    scriptFile.parent.absoluteURI + '/icons/MainWindow_PlayIcon.png'
  );
  var MainWindow_ImportIcon = new File(
    scriptFile.parent.absoluteURI + '/icons/MainWindow_ImportIcon.png'
  );
  var MainWindow_RevealIcon = new File(
    scriptFile.parent.absoluteURI + '/icons/MainWindow_RevealIcon.png'
  );
  var MainWindow_RefreshIcon = new File(
    scriptFile.parent.absoluteURI + '/icons/MainWindow_RefreshIcon.png'
  );
  var MainWindow_FilesIcon = new File(
    scriptFile.parent.absoluteURI + '/icons/MainWindow_FilesIcon.png'
  );
  var MainWindow_SettingsIcon = new File(
    scriptFile.parent.absoluteURI + '/icons/MainWindow_SettingsIcon.png'
  );
  var MainWindow_IncrementIcon = new File(
    scriptFile.parent.absoluteURI + '/icons/MainWindow_IncrementIcon.png'
  );
  var MainWindow_ResetIcon = new File(
    scriptFile.parent.absoluteURI + '/icons/MainWindow_ResetIcon.png'
  );
  var MainWindow_Sep = new File(
    scriptFile.parent.absoluteURI + '/icons/MainWindow_Sep.png'
  );

  var FrameWindow = function() {
    var initX = 600;

    /**
     * Sets the information about the current project/status.
     * @param  {[type]} window  [description]
     * @param  {[type]} inInfo1 [description]
     * @param  {[type]} inInfo2 [description]
     * @param  {[type]} inInfo3 [description]
     * @param  {[type]} inInfo4 [description]
     */
    function setinfo(window, inInfo1, inInfo2, inInfo3, inInfo4) {
      var infoField1 = window.findElement('infoField1');
      var infoField2 = window.findElement('infoField2');
      var infoField3 = window.findElement('infoField3');
      var infoField4 = window.findElement('infoField4');

      infoField1.text = inInfo1;
      infoField2.text = inInfo2;
      infoField3.text = inInfo3;
      infoField4.text = inInfo4;
    };

    /**
     * Sets the contents of the frame inspector
     * @param  {[type]} window       [description]
     * @param  {[type]} inNumColumns [description]
     * @param  {[type]} inColumn1    [description]
     * @param  {[type]} inColumn2    [description]
     * @param  {[type]} inColumn3    [description]
     */
    function setlist(window, inNumColumns, inColumn1, inColumn2, inColumn3) {
      var item;
      var listGroup = window.findElement('listGroup');
      var listItem = window.findElement('listItem');
      var searchGroup = window.findElement('searchGroup');

      if (inColumn1.length > 0) {
        for (var i = 0; i < inColumn1.length; i++) {
          if (!(inColumn1[i] == ('Invalid path.' || 'Error.'))) {
            searchGroup.enabled = true;
            listGroup.enabled = true;

            item = listItem.add('item', inColumn1[i]);

            if (inNumColumns >= 2) {
              item.subItems[0].text = ellipsis(inColumn2[i]);
            };
            if (inNumColumns >= 3) {
              item.subItems[1].text = ellipsis(inColumn3[i]);
            };

            if (inColumn2[i] === 'Invalid destination folder selected.') {
              break;
            }
          } else {
            item = listItem.add('item', inColumn1[i]);
            searchGroup.enabled = false;
            listGroup.enabled = false;
            break;
          }
        }
      } else {
        item = listItem.add('item', 'No items found.');
        listGroup.enabled = false;
        searchGroup.enabled = false;
        if (inNumColumns >= 2) {
          item.subItems[0].text = '-';
        };
      }
      window.layout.layout(true);
      window.layout.resize();
    };

    /**
     * Creates the window
     * @param  {[type]} inTitle      [description]
     * @param  {[type]} inNumColumns [description]
     * @param  {[type]} columnTitles [description]
     * @return {[type]}              [description]
     */
    function createUI(inTitle, inNumColumns, columnTitles) {
      var columnWidths = [
        (initX / 6) * 3.5,
        (initX / 6) * 1.5,
        (initX / 6) - 25,
      ];

      var w = new Window('dialog', inTitle, undefined, {
        resizeable: false,
      });
      w.alignChildren = 'left';
      w.margins = 10;
      w.spacing = 5;

      /**
       * Called when the window is closed
       */
      function button_cancel_onClick() {
        refreshButton_onClick();
        w.close();
        w = undefined;
      }

      /**
       * Deletes the selected frames
       */
      function deleteButton_onClick() {
        var listItem = w.findElement('listItem');

        if (listItem.selection) {
          var selected = listItem.selection;
          var file = new File('/c/temp01234.tmp');
          var result = false;

          var text = 'Are you sure you want to delete the selected files?';
          text += '\n\nThis cannot be undone.';
          var choice = confirm(
            text,
            true,
            'Confirm Delete'
          );

          if (choice) {
            for (var i = 0; i < selected.length; i++) {
              var existingFiles = data.item(index).exists;
              var idx = existingFiles.names.indexOf(selected[i].text);

              while (!file.changePath(existingFiles.fsNames[idx])) {
                selected[i].text = 'Updating...';
              };

              if (file.exists) {
                result = file.remove();
                if (result) {
                  selected[i].enabled = false;
                  selected[i].text = 'Deleted.';
                } else {
                  var text = 'Sorry, there was an error deleteing the file.';
                  text += '\nUnkown error.';
                  Window.alert(
                    text,
                    'Render Queue+'
                  );
                }
              } else {
                var text = 'Sorry, there was an error deleteing the file.';
                text += '\nFile doesn\'t exist.';
                Window.alert(
                  text,
                  'Render Queue+'
                );
              }
            }
          }
        } else {
          Window.alert(
            'Select an item from the list below before continuing.'
          );
        }
      };

      /**
       * Reveal the selected item in the explorer
       */
      function browseButton_onClick() {
        data.item(index).file.parent.execute();
      };

      /**
       * Refreshes the data
       */
      function refreshButton_onClick() {
        data = new Data;

        var listItem = w.findElement('listItem');
        listItem.removeAll();
        setlist(
          w,
          3,
          data.item(index).exists.names,
          data.item(index).exists.dates,
          data.item(index).exists.sizes
        );

        var cs = mainWindow.getSelection();
        mainWindow.clear();
        mainWindow.setlist(
          data.compnames,
          data.filenames,
          data.rendered.frames,
          data.missing.frames,
          data.incomplete.frames,
          data.rendered.sizes
        );
        mainWindow.setSelection(cs);

        settings.setbasepath();
      };

      /**
       * Imports the selected frame
       */
      function importButton_onClick() {
        var listItem = w.findElement('listItem');

        var selected = listItem.selection;

        if (listItem.selection) {
          for (var i = 0; i < selected.length; i++) {
            idx = selected[i].index;
            try {
              importFootage(
                data.item(index).exists.fsNames[idx],
                false,
                data.item(index).compname,
                pathcontrol.getVersionString()
              );
            } catch (e) {
              Window.alert(e);
            }
          }
        }
      };

      /**
       * Reveals inclomplete frames
       */
      function incompleteButton_onClick() {
        var listItem = w.findElement('listItem');
        listItem.removeAll();

        if (state == false) {
          state = true;
          setlist(
            w,
            3,
            data.item(index).incomplete.names,
            data.item(index).incomplete.dates,
            data.item(index).incomplete.sizes
          );
        } else {
          state = false;
          setlist(
            w,
            3,
            data.item(index).exists.names,
            data.item(index).exists.dates,
            data.item(index).exists.sizes
          );
        }
      }

      var elemSize = 20;
      var controlsGroup = w.add(
        'group',
        undefined,
        {
          name: 'headerGroup',
          orientation: 'row',
        }
      );
      controlsGroup.margins = [5, 5, 0, 0];
      controlsGroup.spacing = 5;
      controlsGroup.alignChildren = ['left', 'top'];

      var deleteButton = controlsGroup.add(
        'iconbutton',
        undefined,
        redbinPNG,
        {
          name: 'deleteButton',
        }
      );
      deleteButton.size = [elemSize, elemSize];
      deleteButton.onClick = deleteButton_onClick;

      var sep = controlsGroup.add(
        'iconbutton',
        undefined,
        MainWindow_Sep,
        {
          style: 'toolbutton',
        }
      );
      sep.enabled = false;
      sep.size = [1, elemSize];

      var browseButton = controlsGroup.add(
        'iconbutton',
        undefined,
        MainWindow_RevealIcon,
        {
          name: 'browseButton',
          style: 'toolbutton',
        }
      );
      browseButton.onClick = browseButton_onClick;
      browseButton.size = [elemSize, elemSize];

      var importButton = controlsGroup.add(
        'iconbutton',
        undefined,
        MainWindow_ImportIcon,
        {
          name: 'importButton',
          style: 'toolbutton',
        }
      );
      importButton.onClick = importButton_onClick;
      importButton.size = [elemSize, elemSize];

      var incompleteButton = controlsGroup.add(
        'button',
        undefined,
        'Show Incomplete',
        {
          name: 'incompleteButton',
          style: 'toolbutton',
        }
      );
      incompleteButton.onClick = incompleteButton_onClick;
      incompleteButton.size = [115, elemSize];

      var refreshButton = controlsGroup.add(
        'iconbutton',
        undefined,
        MainWindow_RefreshIcon,
        {
          name: 'refreshButton',
          style: 'toolbutton',
        }
      );
      refreshButton.onClick = refreshButton_onClick;
      refreshButton.size = [elemSize, elemSize];

      var sep1 = w.add(
        'group',
        undefined,
        {
          name: 'sep1',
          orientation: 'row',
        }
      );
      sep1.size = [20, 20];

      var infoGroup4 = w.add(
        'group',
        undefined, {
          name: 'infoGroup4',
          orientation: 'row',
        }
      );

      var infoField4 = infoGroup4.add(
        'edittext',
        undefined,
        '-',
        {
          name: 'infoField4',
        }
      );

      var infoGroup1 = w.add(
        'group',
        undefined,
        {
          name: 'infoGroup1',
          orientation: 'row',
        }
      );

      var infoField1 = infoGroup1.add(
        'statictext',
        undefined,
        '-',
        {
          name: 'infoField1',
        }
      );

      var infoGroup2 = w.add(
        'group',
        undefined,
        {
          name: 'infoGroup2',
          orientation: 'row',
        }
      );

      var infoField2 = infoGroup2.add(
        'statictext',
        undefined,
        '-',
        {
          name: 'infoField2',
        }
      );

      var infoGroup3 = w.add(
        'group',
        undefined, {
          name: 'infoGroup3',
          orientation: 'row',
        }
      );

      var infoField3 = infoGroup3.add(
        'statictext',
        undefined,
        '-',
        {
          name: 'infoField3',
        }
      );

      infoGroup1.margins = 0;
      infoGroup2.margins = 0;
      infoGroup3.margins = 0;
      infoGroup4.margins = 0;

      infoGroup1.spacing = 0;
      infoGroup2.spacing = 0;
      infoGroup3.spacing = 0;
      infoGroup4.spacing = 0;

      infoGroup1.alignChildren = 'left';
      infoGroup2.alignChildren = 'left';
      infoGroup3.alignChildren = 'left';
      infoGroup4.alignChildren = 'left';

      var searchGroup = w.add('group', undefined, {
        name: 'searchGroup',
        orientation: 'row',
      });
      searchGroup.alignChildren = ['left', 'top'];
      searchGroup.margins = [0, 0, 0, 0];
      searchGroup.spacing = 0;

      var searchField = searchGroup.add('edittext', undefined, '-', {
        multiline: false,
        name: 'searchField',
      });

      // List

      var listGroup = w.add('group', undefined, {
        name: 'listGroup',
        orientation: 'row',
      });
      listGroup.margins = 0;
      listGroup.spacing = 0;
      listGroup.alignChildren = 'left';

      var listItem = listGroup.add('listbox', undefined, '', {
        name: 'listItem',
        multiselect: true,
        numberOfColumns: inNumColumns,
        showHeaders: true,
        columnTitles: columnTitles,
        columnWidths: columnWidths,
      });
      listItem.margins = 0;
      listItem.spacing = 0;
      listItem.onDoubleClick = function() {
        app.project.renderQueue.showWindow(true);
      };

      // Footer

      var footerGroup = w.add('group', undefined, {
        alignChildren: ['left', 'top'],
        orientation: 'row',
      });
      footerGroup.margins = 10;
      footerGroup.spacing = 0;

      var button_cancel = footerGroup.add('button', undefined, 'Close', {
        name: 'button_cancel',
      });
      button_cancel.size = [100, 20];
      button_cancel.onClick = button_cancel_onClick;
      button_cancel.margins = 0;
      button_cancel.spacing = 0;

      searchGroup.size = [initX, 20];
      searchField.size = [initX, 20];

      infoGroup1.size = [initX, 20];
      infoGroup2.size = [initX, 20];
      infoGroup3.size = [initX, 20];
      infoGroup4.size = [initX, 20];
      infoField1.size = [initX, 20];
      infoField2.size = [initX, 20];
      infoField3.size = [initX, 20];
      infoField4.size = [initX, 20];

      listGroup.size = listItem.size = [initX, 500];

      w.layout.layout(true);
      w.layout.resize();

      w.onResizing = w.onResize = function() {
        searchGroup.size = [w.size.width, 20];
        searchField.size = [w.size.width, 20];
        infoGroup1.size = [w.size.width, 20];
        infoGroup2.size = [w.size.width, 20];
        infoGroup3.size = [w.size.width, 20];
        infoGroup4.size = [w.size.width, 20];
        infoField1.size = [w.size.width, 20];
        infoField2.size = [w.size.width, 20];
        infoField3.size = [w.size.width, 20];
        infoField4.size = [w.size.width, 20];

        listGroup.size = [w.size.width, 500];
        listItem.size = [w.size.width, 500];
        w.layout.resize();
      };

      return w;
    }

    var state = false;
    var index;

    var cls = function() {
      var window;

      this.setIndex = function(i) {
        index = i;
        return index;
      };

      this.getIndex = function() {
        return index;
      };

      this.show = function(
        inTitle, inInfo1, inInfo2, inInfo3, inInfo4,
        inNumColumns, columnTitles, inColumn1, inColumn2, inColumn3) {
        if (!window) {
          window = createUI(inTitle, inNumColumns, columnTitles);
          setlist(window, inNumColumns, inColumn1, inColumn2, inColumn3);
          setinfo(window, inInfo1, inInfo2, inInfo3, inInfo4);
        }
        window.show();
      };
    };

    return cls;
  }();


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
            alert(e);
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
            alert(e);
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


  var Data = function() {
    var DATA;

    /**
     * [setData description]
     * @param {[type]} dataObj [description]
     * @return {object}
     */
    function setData(dataObj) {
       var omFile = dataObj.omItem.file;
       var omName = omFile.name;
       var omParentFsName = omFile.parent.fsName;

      if (!(dataObj.ready && omFile)) {
        dataObj.sequencename = 'File not yet specified.';
        dataObj.filename = 'File not yet specified.';
        dataObj.ext = null;
        dataObj.padding = null;

        dataObj.exists = {
          frames: '-',
          names: ['No files rendered.'],
          fsNames: [],
          size: formatBytes(0, 2),
          sizes: [],
          dates: [],
          count: 0,
        };

        dataObj.rendered = {
          frames: '-',
          names: ['No files rendered.'],
          fsNames: [],
          size: formatBytes(0, 2),
          sizes: [],
          dates: [],
          count: 0,
        };

        dataObj.missing = {
          frames: '-',
          names: ['No files rendered.'],
          fsNames: [],
          size: formatBytes(0, 2),
          sizes: [],
          dates: [],
          count: 0,
        };

        dataObj.incomplete = {
          frames: '-',
          names: ['No files rendered.'],
          fsNames: [],
          size: formatBytes(0, 2),
          sizes: [],
          dates: [],
          count: 0,
        };
        return dataObj;
      }

      var oneframe = dataObj.rqItem.comp.frameDuration;
      dataObj.startframe = Math.round(
        (dataObj.rqItem.timeSpanStart / oneframe) +
        (dataObj.rqItem.comp.displayStartTime / oneframe)
      );
      dataObj.endframe = Math.round(
        (dataObj.rqItem.timeSpanStart / oneframe) +
        (dataObj.rqItem.timeSpanDuration / oneframe)
      );
      dataObj.duration = Math.round(
        dataObj.endframe - dataObj.startframe
      );

      dataObj.padding = getPadding(omName);
      dataObj.ext = omName.slice(-3);
      if (!dataObj.padding) {
        dataObj.sequencename = (
          decodeURI(decodeURI(omName)) + ' ' + '[' +
          pad(dataObj.startframe, dataObj.padding) + '-' +
          pad(dataObj.endframe, dataObj.padding) + ']'
        );
      } else {
        dataObj.sequencename = (
          decodeURI(decodeURI(omName).slice(
            0, ((dataObj.padding + 2 + 4) * (-1)))) +
          '[' + pad(dataObj.startframe, dataObj.padding) + '-' +
          pad(dataObj.endframe, dataObj.padding) + ']' + '.' + dataObj.ext
        );
      };

      dataObj.filename = (
        decodeURI(omFile.parent.name) +
        sep +
        decodeURI(dataObj.sequencename)
      );

      var stat = new Directory(omFile.parent);
      var files;

      if (dataObj.padding > 0) {
        files = stat.files('*.' + dataObj.ext);
      } else {
        files = stat.files(omFile.displayName);
      }

      if (files.item(0).name == ('Invalid path.' || 'Error.')) {
        dataObj.exists = {
          frames: '-',
          names: [],
          fsNames: [],
          size: formatBytes(0, 2),
          sizes: [formatBytes(0, 2)],
          dates: [],
          count: 0,
        };

        dataObj.rendered = {
          frames: '-',
          names: [],
          fsNames: [],
          size: formatBytes(0, 2),
          sizes: [formatBytes(0, 2)],
          dates: [],
          count: 0,
        };

        dataObj.missing = {
          frames: '-',
          names: [],
          fsNames: [],
          size: formatBytes(0, 2),
          sizes: [formatBytes(0, 2)],
          dates: [],
          count: 0,
        };

        dataObj.incomplete = {
          frames: '-',
          names: [],
          fsNames: [],
          size: formatBytes(0, 2),
          sizes: [formatBytes(0, 2)],
          dates: [],
          count: 0,
        };

        return dataObj;
      }

      var frame;
      var name;
      var names = files.names;
      var fsName;
      var index;
      var file;
      var notmissingNames = [];
      var notmissingFrames = [];
      var notmissingfsNames = [];
      var notmissingSizes = [];
      var notmissingDates = [];
      var existsNames = [];
      var existsFrames = [];
      var existsfsNames = [];
      var existsSizes = [];
      var existsDates = [];
      var missingNames = [];
      var missingFrames = [];
      var missingfsNames = [];
      var partialNames = [];
      var partialFrames = [];
      var partialfsNames = [];
      var partialSizes = [];
      var partialDates = [];
      var size = 0;

      if (dataObj.padding > 0) {
        var sframe = parseInt(dataObj.startframe, 10);
        var dframe = parseInt(dataObj.duration, 10);

        for (var i = sframe; i <= dframe + sframe; i++) {
          frame = pad(i, dataObj.padding);
          name = (
            decodeURI(omName).slice(0, (dataObj.padding + 2 + 4) * (-1)) +
            frame + '.' + dataObj.ext
          );
          index = names.indexOf(name);
          file = files.item(index);
          fsName = omParentFsName + sep + name;

          if (index >= 0) {
            notmissingNames.push(name);
            notmissingFrames.push(parseInt(frame, 10));
            notmissingfsNames.push(fsName);
            notmissingSizes.push(formatBytes(file.size, 2));
            notmissingDates.push(file.date + ' ' + file.time);

            if (files.sizes[index] > 50) {
              existsNames.push(name);
              existsFrames.push(parseInt(frame, 10));
              existsfsNames.push(fsName);
              existsSizes.push(formatBytes(file.size, 2));
              existsDates.push(file.date + ' ' + file.time);
              size += file.size;
            } else {
              partialNames.push(name);
              partialFrames.push(parseInt(frame, 10));
              partialfsNames.push(fsName);
              partialSizes.push(formatBytes(file.size, 2));
              partialDates.push(file.date + ' ' + file.time);
            }
          } else if (index == -1) {
            missingNames.push(name);
            missingFrames.push(parseInt(frame, 10));
            missingfsNames.push(fsName);
          }
        } // end of loop
        dataObj.exists = {
          frames: getRanges(notmissingFrames),
          names: notmissingNames,
          fsNames: notmissingfsNames,
          size: formatBytes(size, 2),
          sizes: notmissingSizes,
          dates: notmissingDates,
          count: notmissingFrames.length,
        };
        dataObj.rendered = {
          frames: getRanges(existsFrames),
          names: existsNames,
          fsNames: existsfsNames,
          size: formatBytes(size, 2),
          sizes: existsSizes,
          dates: existsDates,
          count: existsNames.length,
        };

        dataObj.missing = {
          frames: getRanges(missingFrames),
          names: missingNames,
          fsNames: missingfsNames,
          size: 0,
          sizes: [],
          dates: [],
          count: missingNames.length,
        };
        dataObj.incomplete = {
          frames: getRanges(partialFrames),
          names: partialNames,
          fsName: partialfsNames,
          size: 0,
          sizes: partialSizes,
          dates: partialDates,
          count: partialNames.length,
        };
      } else {
        frame = 1;
        name = decodeURI(omName);
        index = names.indexOf(name);
        fsName = omParentFsName + sep + name;

        if (index >= 0) {
          notmissingNames.push(name);
          notmissingFrames.push(parseInt(frame, 10));
          notmissingfsNames.push(fsName);
          notmissingSizes.push(formatBytes(file.size, 2));
          notmissingDates.push(file.date + ' ' + file.time);
          if (files.sizes[index] > 50) {
            existsNames.push(name);
            existsFrames.push(parseInt(frame, 10));
            existsfsNames.push(fsName);
            existsSizes.push(formatBytes(file.size, 2));
            existsDates.push(file.date + ' ' + file.time);
            size += file.size;
          } else {
            partialNames.push(name);
            partialFrames.push(parseInt(frame, 10));
            partialfsNames.push(fsName);
            partialSizes.push(formatBytes(file.size, 2));
            partialDates.push(file.date + ' ' + file.time);
          }
        }

        if (index == -1) {
          missingNames.push(name);
          missingFrames.push(parseInt(frame, 10));
          missingfsNames.push(fsName);
        }

        dataObj.exists = {
          frames: 1,
          names: [files.items[0].name],
          fsNames: notmissingfsNames,
          size: formatBytes(size, 2),
          sizes: notmissingSizes,
          dates: notmissingDates,
          count: notmissingFrames.length,
        };

        dataObj.rendered = {
          frames: getRanges(existsFrames),
          names: existsNames,
          fsNames: existsfsNames,
          size: formatBytes(size, 2),
          sizes: existsSizes,
          dates: existsDates,
          count: existsNames.length,
        };

        dataObj.missing = {
          frames: getRanges(missingFrames),
          names: missingNames,
          fsNames: missingfsNames,
          size: 0,
          sizes: [],
          dates: [],
          count: missingNames.length,
        };

        dataObj.incomplete = {
          frames: getRanges(partialFrames),
          names: partialNames,
          fsName: partialfsNames,
          size: 0,
          sizes: partialSizes,
          dates: partialDates,
          count: partialNames.length,
        };
      }
      return dataObj;
    }

    var cls = function() {
      this.items = function() {
        var dataObj = {};
        var dataObjs = [];

        for (var i = 1; i <= app.project.renderQueue.numItems; i++) {
          var rqItem = app.project.renderQueue.item(i);

          for (var j = 1; j <= rqItem.numOutputModules; j++) {
            dataObj = {};

            dataObj.ready = (function() {
              if (rqItem.status == RQItemStatus.QUEUED) {
                return true;
              } else if (rqItem.status == RQItemStatus.NEEDS_OUTPUT) {
                return true;
              } else if (rqItem.status == RQItemStatus.UNQUEUED) {
                return true;
              } else if (rqItem.status == RQItemStatus.DONE) {
                return false;
              };
            })();

            dataObj.rqItem = rqItem;
            dataObj.omItem = rqItem.outputModule(j);
            dataObj.comp = dataObj.rqItem.comp;
            dataObj.compname = dataObj.comp.name;
            dataObj.rqindex = i;

            dataObj.file = function() {
              if (dataObj.ready) {
                if (dataObj.omItem.file) {
                  return dataObj.omItem.file;
                } else {
                  return null;
                };
              } else {
                return null;
              };
            }();

            dataObj.filename = null;

            dataObj.sequencename = null;
            dataObj.ext = null;
            dataObj.padding = null;
            dataObj.startframe = null;
            dataObj.endframe = null;
            dataObj.duration = null;

            dataObj.exists = {
              frames: null,
              names: null,
              fsNames: null,
              size: null,
              sizes: null,
              dates: null,
              count: null,
            };

            dataObj.rendered = {
              frames: null,
              names: null,
              fsNames: null,
              size: null,
              sizes: null,
              dates: null,
              count: null,
            };

            dataObj.missing = {
              frames: null,
              names: null,
              fsNames: null,
              size: null,
              sizes: null,
              dates: null,
              count: null,
            };

            dataObj.incomplete = {
              frames: null,
              names: null,
              fsName: null,
              size: null,
              sizes: null,
              dates: null,
              count: null,
            };

            dataObj.set = setData;
            dataObj.set(dataObj);
            dataObjs.push(dataObj);
          }
        }
        DATA = dataObjs;
        return dataObjs;
      }();

      this.item = function(index) {
        return DATA[index];
      };

      this.files = function() {
        var arr = [];
        if (DATA.length === 0) {
          arr = [];
          return arr;
        } else {
          for (var i = 0; i < DATA.length; i++) {
            arr.push(DATA[i].file);
          }
          return arr;
        }
      }();

      this.rqItems = function() {
        var arr = [];
        if (DATA.length === 0) {
          arr = [];
          return arr;
        } else {
          for (var i = 0; i < DATA.length; i++) {
            arr.push(DATA[i].rqItem);
          }
          return arr;
        }
      }();

      this.omItems = function() {
        var arr = [];
        if (DATA.length === 0) {
          arr = [];
          return arr;
        } else {
          for (var i = 0; i < DATA.length; i++) {
            arr.push(DATA[i].omItem);
          }
          return arr;
        }
      }();

      this.compnames = function() {
        var arr = [];
        if (DATA.length === 0) {
          arr = ['No active output modules found.'];
          return arr;
        } else {
          for (var i = 0; i < DATA.length; i++) {
            arr.push(DATA[i].compname);
          }
          return arr;
        }
      }();

      this.rqindexes = function() {
        var arr = [];
        if (DATA.length === 0) {
          arr = [];
          return arr;
        } else {
          for (var i = 0; i < DATA.length; i++) {
            arr.push(DATA[i].rqindex);
          }
          return arr;
        }
      }();

      this.sequencenames = function() {
        var arr = [];
        if (DATA.length === 0) {
          arr = ['No active output modules found.'];
          return arr;
        } else {
          for (var i = 0; i < DATA.length; i++) {
            arr.push(DATA[i].sequencename);
          }
          return arr;
        }
      }();

      this.filenames = function() {
        var arr = [];
        if (DATA.length === 0) {
          arr = ['No active output modules found'];
          return arr;
        } else {
          for (var i = 0; i < DATA.length; i++) {
            if (DATA[i].file) {
              arr.push(DATA[i].filename);
            } else {
              arr.push('Unqueued');
            }
          }
          return arr;
        }
      }();

      this.durations = function() {
        var arr = [];
        if (DATA.length === 0) {
          arr = ['No active output modules found'];
          return arr;
        } else {
          for (var i = 0; i < DATA.length; i++) {
            arr.push(DATA[i].duration);
          }
          return arr;
        }
      }();

      this.rendered = function() {
        var returnObj = {
          frames: [],
          names: [],
          fsNames: [],
          sizes: [],
          counts: [],
        };

        if (DATA.length === 0) {
          return returnObj;
        } else {
          for (var i = 0; i < DATA.length; i++) {
            returnObj.frames.push(DATA[i].rendered.frames);
            returnObj.names.push(DATA[i].rendered.names);
            returnObj.fsNames.push(DATA[i].rendered.fsNames);
            returnObj.sizes.push(DATA[i].rendered.size);
            returnObj.counts.push(DATA[i].rendered.count);
          }
          return returnObj;
        }
      }();

      this.missing = function() {
        var returnObj = {
          frames: [],
          names: [],
          fsNames: [],
          counts: [],
        };

        var frames = [];
        var names = [];
        var fsNames = [];
        var counts = [];

        if (DATA.length === 0) {
          return returnObj;
        } else {
          for (var i = 0; i < DATA.length; i++) {
            frames.push(DATA[i].missing.frames);
            names.push(DATA[i].missing.names);
            fsNames.push(DATA[i].missing.fsNames);
            counts.push(DATA[i].missing.count);
          }
          returnObj.frames = frames;
          returnObj.names = names;
          returnObj.fsNames = fsNames;
          returnObj.counts = counts;

          return returnObj;
        }
      }();

      this.incomplete = function() {
        var returnObj = {
          frames: [],
          names: [],
          fsNames: [],
          counts: [],
        };

        var frames = [];
        var names = [];
        var fsNames = [];
        var counts = [];

        if (DATA.length === 0) {
          return returnObj;
        } else {
          for (var i = 0; i < DATA.length; i++) {
            frames.push(DATA[i].incomplete.frames);
            names.push(DATA[i].incomplete.names);
            fsNames.push(DATA[i].incomplete.fsNames);
            counts.push(DATA[i].incomplete.count);
          }
          returnObj.frames = frames;
          returnObj.names = names;
          returnObj.fsNames = fsNames;
          returnObj.counts = counts;

          return returnObj;
        }
      }();
      this.exists = function() {
        var returnObj = {
          frames: [],
          names: [],
          fsNames: [],
          counts: [],
        };

        var frames = [];
        var names = [];
        var fsNames = [];
        var counts = [];

        if (DATA.length === 0) {
          return returnObj;
        } else {
          for (var i = 0; i < DATA.length; i++) {
            frames.push(DATA[i].exists.frames);
            names.push(DATA[i].exists.names);
            fsNames.push(DATA[i].exists.fsNames);
            counts.push(DATA[i].exists.count);
          }
          returnObj.frames = frames;
          returnObj.names = names;
          returnObj.fsNames = fsNames;
          returnObj.counts = counts;

          return returnObj;
        }
      }();
    };
    return cls;
  }();


  var Pathcontrol = function(omItem, rqItem) {
    /**
     * Module is responsible for setting the output path
     * @type {outputModule} omItem - the current output module
     * @type {renderQueueItem} rqItem - the current output module
     */

    {
      var props = {};
      props.extension = null;
      props.customsuffix = null;
      props.versionString = function() {
        return 'v' + pad(props.version, 3);
      };
      props.paddingString = function() {
        if (props.padding == 0) {
          return '';
        };
        if (props.padding == 1) {
          return '[#]';
        };
        if (props.padding == 2) {
          return '[##]';
        };
        if (props.padding == 3) {
          return '[###]';
        };
        if (props.padding == 4) {
          return '[####]';
        };
        if (props.padding == 5) {
          return '[#####]';
        };
      };
      props.version = null;
      props.padding = null;
      props.basepath = null;
      props.template = null;
      props.om = function() {
        return ({
          'Output File Info': {
            'Base Path': props.basepath,
            'File Template': props.template,
          },
        });
      };
    }


    var cls = function(omItem, rqItem) {
      var cls = this;

      this.getVersionNumberFromString = function(s) {
        return getVersionNumberFromString(s);
      };

      this.setOMItem = function(inOMItem) {
        omItem = inOMItem;
        return omItem;
      };

      this.setRQItem = function(inRQItem) {
        rqItem = inRQItem;
        return rqItem;
      };

      this.setVersion = function(inNum) {
        props.version = inNum;
        return props.version;
      };

      this.setPadding = function(inString) {
        props.padding = inString;
        return props.padding;
      };

      this.setBasepath = function(inString) {
        props.basepath = inString;
        return props.basepath;
      };

      this.parsePath = function() {
        var settings = omItem.getSettings(GetSettingsFormat.STRING_SETTABLE);
        var template = settings['Output File Info']['File Template'];
        var padding = getPadding(template);
        var version = cls.getVersionNumberFromString(template);

        if (!padding) {
          padding = 0;
        }
        props.padding = padding;
        props.version = version;

        var returnObj = {};
        returnObj.padding = padding;
        returnObj.version = version;
        return returnObj;
      }();

      this.getVersionString = function() {
        return 'v' + pad(props.version, 3);
      };

      this.getVersion = function() {
        return props.version;
      };

      this.getPaddingString = function() {
        return props.paddingString();
      };

      this.getPadding = function() {
        return props.padding;
      };

      this.getBasepath = function() {
        return props.basepath;
      };

      this.getVersions = function() {
        var baseFolder;
        var subFolders;
        var versionFolders = [];

        if (!props.basepath) {
          return versionFolders;
        }

        baseFolder = new Folder(props.basepath);

        if (!baseFolder.exists) {
          return versionFolders;
        }

        var subFolders = baseFolder.getFiles(function(elem) {
          if (elem instanceof Folder) {
            return true;
          } else {
            return false;
          }
        });

        for (var i = 0; i < subFolders.length; i++) {
          if (subFolders[i].displayName.match(/v\d\d\d/gi)) {
            versionFolders.push(subFolders[i]);
          }
        }
        return versionFolders;
      };

      this.getOM = function() {
        return props.om();
      };

      this.getOMItem = function() {
        return omItem;
      };

      this.getRQItem = function() {
        return RQItem;
      };

      this.apply = function() {
        var foldersOK = false;

        if (settings.getSetting('pathcontrol_fsName')) {
          var rendersBase = new Folder(
            settings.getSetting('pathcontrol_fsName')

          );
          try {
            rendersBase.create();
            foldersOK = true;
          } catch (e) {
            foldersOK = false;
            var text = 'Sorry, Unable to create render base folder:';
            text += '\n\n\n' + e;
            Window.alert(text, 'Version Control: Error');
          }
        } else {
          var text = 'The output base path has not been set.';
          text += '\nCheck the panel preferences if you have ';
          text += 'a valid pattern set.\n\nNote: You can still set ';
          text += 'the destination manually in the Render Queue.';
          Window.alert(text);
        }

        if (foldersOK) {
          if (props.padding > 0) {
            props.template = (
              props.versionString() + '/' + '[compName]' + '_' +
              props.versionString() + '_' +
              props.paddingString() + '.[fileExtension]'
            );
          }
          if (props.padding == 0) {
            props.template = (
              props.versionString() + '/' + '[compName]' + '_' +
              props.versionString() + '.[fileExtension]'
            );
          }
        }

        try {
          omItem.setSettings(props.om());
        } catch (e) {
          var text = 'Sorry, unable to set output module path.';
          text += '\n\nMake sure the module is queued and ready';
          text += ' to render in the Render Queue.';
          Window.alert(text, 'Invalid Render Queue Item Status.');
        }
      };
    };
    return cls;
  }();


  var MainWindow = function(thisObj, inTitle, inNumColumns,
    columnTitles, columnWidths) {
    /**
     * Main window
     * @return {[type]} [description]
     */

    var cls = function() {
      this.setSelection = function(index) {
        return cls.prototype.setSelection(index);
      };

      this.getSelection = function() {
        return cls.prototype.getSelection();
      };

      this.palette = function() {
        return palette;
      }();

      this.show = function() {
        return cls.prototype.show();
      };

      this.hide = function() {
        return cls.prototype.hide();
      };

      this.cleardropdown = function() {
        return cls.prototype.cleardropdown();
      };

      this.setlist = function(inColumn1, inColumn2, inColumn3,
        inColumn4, inColumn5, inColumn6) {
        return cls.prototype.setlist(
          inColumn1,
          inColumn2,
          inColumn3,
          inColumn4,
          inColumn5,
          inColumn6
        );
      };

      this.disable = function() {
        return cls.prototype.disable();
      };

      this.clear = function() {
        return cls.prototype.clear();
      };
    };

    cls.prototype = {
      show: function() {
        if (palette instanceof Window) {
          listItem = palette.findElement('listItem');
          listGroup = palette.findElement('listGroup');
        }

        listItem.size.width = (function() {
          var width = 0;
          for (var i = 0; i < inNumColumns; i++) {
            width += parseInt(columnWidths[i], 10);
          }
          return width + 66;
        })();

        if (listItem.size[1] > 500) {
          listItem.size.height = 500;
        }

        var listItemWidth = 1236;
        var margin = 15;

        if (palette instanceof Panel) {
          listGroup.size[0] = listItemWidth + (
            palette.size.width - listItemWidth - margin
          );
          listItem.size[0] = listItemWidth + (
            palette.size.width - listItemWidth - margin
          );

          listGroup.size[1] = palette.size[1] - 45;
          listItem.size[1] = palette.size[1] - 45;

          palette.layout.layout(true);
          palette.layout.resize();

          palette.onResizing = palette.onResize = function() {
            listGroup.size[0] = listItemWidth + (
              palette.size.width - listItemWidth - margin
            );
            listItem.size[0] = listItemWidth + (
              palette.size.width - listItemWidth - margin
            );

            listGroup.size[1] = palette.size[1] - 45;
            listItem.size[1] = palette.size[1] - 45;

            palette.layout.layout(true);
            palette.layout.resize();
          };
        }

        if (!(palette instanceof Panel)) {
          palette.size.width = listItemWidth + 15;
          palette.size.height = 45 + 350;

          listGroup.size[0] = listItem.size[0] = listItemWidth - (margin);
          listGroup.size[1] = listItem.size[1] = palette.size.height - 65;

          palette.onResizing = palette.onResize = function() {
            listGroup.size[0] = listItemWidth + (
              palette.size.width - listItemWidth - margin - 15
            );
            listItem.size[0] = listItemWidth + (
              palette.size.width - listItemWidth - margin - 15
            );
            listGroup.size[1] = listItem.size[1] = palette.size[1] - 65;
          };
          palette.show();
        };
      },

      hide: function() {
        if (!(palette instanceof Panel)) palette.hide();
      },

      clear: function() {
        listItem.removeAll();
      },

      setlist: function(inColumn1, inColumn2, inColumn3,
        inColumn4, inColumn5, inColumn6) {
        if (palette instanceof Window) {
          listItem = palette.findElement('listItem');
          listGroup = palette.findElement('listGroup');
        }

        /**
         * Sets the color of the status indicator
         * @param  {number} index listItem index number
         * @return {icon}       the icon to use
         */
        function statuscolor(index) {
          var renderedCount = data.item(index).rendered.count;
          var incompleteCount = data.item(index).incomplete.count;
          var missingCount = data.item(index).missing.count;
          var duration = data.item(index).duration;

          if ((renderedCount === duration + 1) && (incompleteCount === 0)) {
            return greenIcon;
          }
          if ((renderedCount === duration + 1) && (incompleteCount > 0)) {
            return orangeIcon;
          }
          if ((renderedCount < duration + 1) && (renderedCount > 0)) {
            return orangeIcon;
          }
          if (incompleteCount > 0) {
            return orangeIcon;
          }
          if (missingCount === duration + 1) {
            return redIcon;
          }
          return grayIcon;
        }

        if (
          inColumn1.length > 0 &&
          !(inColumn1[0] === 'No active output modules found.')
        ) {
          var item = '';
          for (var i = 0; i < inColumn1.length; i++) {
            item = listItem.add('item', inColumn1[i]);

            if (data.item(i).ready) {
              item.enabled = true;
              item.image = statuscolor(i);
            } else {
              item.enabled = false;
            };

            if (inNumColumns >= 2) {
              item.subItems[0].text = ellipsis(inColumn2[i]);
            };
            if (inNumColumns >= 3) {
              item.subItems[1].text = ellipsis(inColumn3[i]);
            };
            if (inNumColumns >= 4) {
              item.subItems[2].text = ellipsis(inColumn4[i]);
            };
            if (inNumColumns >= 5) {
              item.subItems[3].text = ellipsis(inColumn5[i]);
            };
            if (inNumColumns >= 6) {
              item.subItems[4].text = ellipsis(inColumn6[i]);
            };

            if (inColumn2[i] === 'Invalid destination folder selected.') {
              break;
            }
          }
        } else {
          item = listItem.add('item', inColumn1[0]);
          item.enabled = false;
        }
      },
      disable: function() {
        button_copy.enabled = false;
        palette.update();
        palette.layout.layout();
      },
      setdropdown: function(inArr) {
        inArr = inArr.sort();
        if (inArr.length > 0) {
          var item;
          for (var i = 0; i < inArr.length; i++) {
            if (
              inArr[i].displayName == ('No rendered versions found' ||
              'Set Version Control')
            ) {
              item = versionsDropdown.add('item', inArr[i].displayName);
              item.enabled = false;
            } else {
              item = versionsDropdown.add('item', inArr[i].displayName);
            };
          }
        }
      },

      cleardropdown: function() {
        versionsDropdown.removeAll();
      },

      aerender: function(promptForFile) {
        var saved;
        try {
          saved = app.project.file.exists;
        } catch (e) {
          saved = false;
        };


        if (listItem.selection && saved) {
          var index = cls.prototype.getSelection();
          var batname = (
            app.project.file.displayName + '-' +
            data.item(index).compname + '.bat'
          );
          bat = new File(settings.tempFolder.fullName + '/' + batname);

          app.project.save();

          var comparchive = new Folder(
            settings.getSetting('pathcontrol_fsName') + sep +
            '.aeparchive' + sep +
            data.item(index).compname + sep +
            pathcontrol.getVersionString()
          );

          comparchive.create();

          try {
            app.project.file.copy(
              comparchive.fsName + sep +
              data.item(index).compname + '_' +
              pathcontrol.getVersionString() + '_' +
              app.project.file.displayName
            );
          } catch (e) {
            Window.alert(e);
          };


          data.item(index).omItem.file.parent.create();

          if (promptForFile) {
            bat.changePath(app.project.file.parent.fullName + '/' + batname);
            bat = bat.openDlg();
          }

          if (bat) {
            var variables = '::' + app.project.file.fsName + '\n' +
              '::' + data.item(index).compname + '\n' +
              'set aerenderPath=' + settings.getSetting('aerender_bin') + '\n' +
              'set project=' + app.project.file.fsName + '\n' +
              'set rqindex=' + data.item(index).rqindex + '\n' +
              'set output=' + data.item(index).omItem.file.fsName + '\n' +
              'set s=' + parseInt(data.item(index).startframe, 10) + '\n' +
              'set e=' + parseInt(data.item(index).endframe, 10) + '\n';

            var cmd = '"%aerenderPath%"' +
              ' -project "%project%"' +
              ' -rqindex %rqindex%' +
              ' -output "%output%"' +
              ' -s %s%' +
              ' -e %e%' +
              ' -sound ON -continueOnMissingFootage';

            var start = (
              'start \"' + 'Rendering ' +
              data.item(index).compname + ' of ' +
              app.project.file.displayName + '\" ' + cmd
            );

            bat.open('w');
            bat.write(variables + '\n' + start);
            bat.close();
            bat.execute();
          }
        }
        if (!saved) {
          Window.alert(
            'Project is not saved.\nYou must save it before continuing.',
            'Project is not yet saved.'
          );
        }
      },

      setSelection: function(index) {
        if (palette instanceof Window) {
          listItem = palette.findElement('listItem');
        };
        listItem.selection = index;
        return listItem.selection;
      },

      getSelection: function() {
        if (palette instanceof Window) {
          listItem = palette.findElement('listItem');
        }
        var s;
        try {
          s = listItem.selection.index;
        } catch (e) {
          s = null;
        }
        return s;
      },
      refresh: function() {
        data = new Data;

        var cs = cls.prototype.getSelection();

        cls.prototype.clear();
        cls.prototype.setlist(
          data.compnames,
          data.filenames,
          data.rendered.frames,
          data.missing.frames,
          data.incomplete.frames,
          data.rendered.sizes
        );

        settings.setbasepath();

        cls.prototype.show();
        cls.prototype.setSelection(cs);
      },
    };


    var palette = thisObj instanceof Panel ? thisObj : new Window(
      'palette',
      inTitle,
      undefined,
      {
        borderless: false,
        resizeable: true,
        orientation: 'row',
      }
    );
    palette.size = [0, 0];

    /**
     * Review the selected render output in external player
     * @return {[type]} [description]
     */
    function playButton_onClick() {
      if (listItem.selection) {
        var player = settings.getSetting('player');
        var index = listItem.selection.index;

        var rvPath = settings.getSetting('rv_bin');
        var rvCall = settings.getSetting('rv_call');

        var rvUsePush = settings.getSetting('rv_usepush');
        var rvpushPath = settings.getSetting('rvpush_bin');

        var djvPath = settings.getSetting('djv_bin');
        var djvCall = settings.getSetting('djv_call');
        var item = data.item(index);
        var sequencePath = item.file.fsName;
        var file = new File(settings.tempFolder.fullName + '/_playercall.bat');
        var cmd;

        if (player === 'rv') {
          if (rvPath == 'null' || rvpushPath == 'null') {
            Window.alert('RV or RV Push path is not set. Check preferences.');
            return false;
          }
          if (item.exists.fsNames[0]) {
            if (pathcontrol.getPadding() > 0) {
              var rvSequencePath = (
                sequencePath.slice(0, -4).slice(0, -1 * (item.padding + 2)) +
                '%%0' + item.padding + 'd' +
                '.' + item.ext
              );

              var rvRange = item.startframe + '-' + item.endframe;

              if (rvUsePush == 'false') {
                cmd = (
                  '\"' + rvPath + '\"' + ' ' + '\"' +
                  rvSequencePath + '\"' + ' ' +
                  rvRange + ' ' + rvCall
                );
              }

              if (rvUsePush == 'true' || rvpushPath) {
                cmd = (
                  '\"' + rvpushPath + '\"' + ' set ' + '\"' +
                  rvSequencePath + '\"' + ' ' +
                  rvRange + ' ' + rvCall
                );
              }
            }

            if (pathcontrol.getPadding() === 0) {
              if (rvUsePush == 'false') {
                cmd = (
                  '\"' + rvPath + '\"' + ' ' + '\"' +
                  sequencePath + '\"' + ' ' + rvCall
                );
              }

              if (rvUsePush == 'true') {
                cmd = (
                  '\"' + rvpushPath + '\"' + ' set ' + '\"' +
                  sequencePath + '\"' + ' ' + rvCall
                );
              }
            }
          } else {
            cmd = null;
          }
        }

        if (player === 'djv') {
          if (item.exists.fsNames[0]) {
            var djvSequencePath = item.exists.fsNames[0];

            if (pathcontrol.getPadding() > 0) {
              cmd = (
                '\"' + djvPath + '\"' + ' ' + '\"' +
                djvSequencePath + '\"' + ' -seq Range -playback_speed ' +
                Math.round(1 / item.comp.frameDuration) + ' ' + djvCall
              );
            }

            if (pathcontrol.getPadding() === 0) {
              cmd = (
                '\"' + djvPath + '\"' + ' ' + '\"' +
                djvSequencePath + '\"' + ' ' + djvCall
              );
            }
          } else {
            cmd = null;
          }
        }

        if (cmd) {
          var string;
          if (File.fs === 'Windows') {
            string = '@echo off\n' +
              'start "" ' + cmd + '\n' +
              'exit /b';

            file.open('w');
            file.write(string);
            file.close();
            file.execute();
          }
        }
      }
    }

    /**
     * Reveal the selected render output in the explorer
     */
    function browseButton_onClick() {
      if (listItem.selection) {
        var index = listItem.selection.index;
        var f = data.item(index).file;
        var p = f.parent;

        if (p.exists) {
          p.execute();
        } else {
          if (p.parent.exits) {
            p.parent.execute();
          } else {
            if (p.parent.parent.exists) {
              p.parent.parent.execute();
            } else {
              if (p.parent.parent.parent.exists) {
                p.parent.parent.parent.execute();
              } else {
                if (p.parent.parent.parent.parent.exists) {
                  p.parent.parent.parent.parent.execute();
                }
              }
            }
          }
        }
      }
    }

    /**
     * Show settings windonw
     */
    function settingsButton_onClick() {
      settings.setbasepath();
      settings.show();
    };


    /**
     * Refresh data
     */
    function refreshButton_onClick() {
      cls.prototype.refresh();
    };

    /**
     * Opens the frame inspector window
     */
    function framesButton_onClick() {
      try {
        if (listItem.selection) {
          var index = listItem.selection.index;

          var frameWindow = new FrameWindow;
          frameWindow.setIndex(index);

          var a = data.item(index).compname;
          var b = (
            'Basepath: ' + '\'' +
            settings.getSetting('pathcontrol_fsName') + '\''
          );
          var c = 'Composition: ' + data.item(index).compname;
          var d = 'Version: ' + (function() {
            if (!pathcontrol.getVersion()) {
              return 'not set';
            } else {
              return pathcontrol.getVersionString();
            }
          }());
          var e = String(data.item(index).omItem.file.fsName);
          var f = data.item(index).exists.names;
          var g = data.item(index).exists.dates;
          var h = data.item(index).exists.sizes;

          frameWindow.show(
            a, b, c, d, e, 3, ['Name', 'Date', 'Size'], f, g, h
          );
        }
      } catch (e) {
        alert(e);
      }
    }

    /**
     * Starts the background render
     */
    function aerenderButton_onClick() {
      cls.prototype.aerender(false);
    }

    /**
     * Start a batch render and create batch file
     */
    function batchButton_onClick() {
      cls.prototype.aerender(true);
    }

    /**
     * Import render output as footage
     */
    function importButton_onClick() {
      if (listItem.selection) {
        var index = listItem.selection.index;
        try {
          importFootage(
            data.item(index).exists.fsNames[0],
            true,
            data.item(index).compname,
            pathcontrol.getVersionString()
          );
        } catch (e) {
          Window.alert(e);
        }
      }
    }

    /**
     * Increments version by one
     */
    function versionsIncrement_onClick() {
      var cs = cls.prototype.getSelection();

      pathcontrol.setVersion(pathcontrol.getVersionNumberFromString() + 1);
      pathcontrol.apply();

      data = new Data;

      cls.prototype.clear();
      cls.prototype.setlist(
        data.compnames,
        data.filenames,
        data.rendered.frames,
        data.missing.frames,
        data.incomplete.frames,
        data.rendered.sizes
      );

      settings.setbasepath();

      cls.prototype.setSelection(cs);
    }

    /**
     * Resets the version to 1
     */
    function versionsReset_onClick() {
      var cs = cls.prototype.getSelection();

      pathcontrol.setVersion(1);
      pathcontrol.apply();

      data = new Data;

      cls.prototype.clear();
      cls.prototype.setlist(
        data.compnames,
        data.filenames,
        data.rendered.frames,
        data.missing.frames,
        data.incomplete.frames,
        data.rendered.sizes
      );

      settings.setbasepath();

      cls.prototype.setSelection(cs);
    }

    /**
     * Event triggered when the dropdown menu selection changes
     * @param  {[type]} versionsDropdown [description]
     */
    function versionsDropdown_onChange(versionsDropdown) {
      if (versionsDropdown.selection === null) {
        return;
      }

      if (versionsDropdown.selection.text === 'Set Version Control') {
        pathcontrol = new Pathcontrol(
          data.item(listItem.selection.index).omItem,
          data.item(listItem.selection.index).rqItem
        );

        if (!pathcontrol.getVersionNumberFromString()) {
          pathcontrol.setVersion(1);
          cls.prototype.cleardropdown();

          var fsName = settings.getSetting('pathcontrol_fsName');

          if (
            fsName[fsName.length - 1] == '/' ||
            fsName[fsName.length - 1] == '\\'
          ) {
            pathcontrol.setBasepath(
              fsName + data.item(listItem.selection.index).compname
            );
          } else {
            pathcontrol.setBasepath(
              fsName + sep + data.item(listItem.selection.index).compname
            );
          }

          cls.prototype.setdropdown(pathcontrol.getVersions());
          pathcontrol.apply();
        }
      } else {
        pathcontrol.setVersion(
          parseInt(versionsDropdown.selection.text.slice(1), 10)
        );

        if (
          fsName[fsName.length - 1] == '/' ||
          fsName[fsName.length - 1] == '\\'
        ) {
          pathcontrol.setBasepath(
            fsName + data.item(listItem.selection.index).compname
          );
        } else {
          pathcontrol.setBasepath(
            fsName + sep + data.item(listItem.selection.index).compname
          );
        }
        pathcontrol.apply();
      }

      data = new Data;

      var s = mainWindow.getSelection();
      mainWindow.clear();

      mainWindow.setlist(
        data.compnames,
        data.filenames,
        data.rendered.frames,
        data.missing.frames,
        data.incomplete.frames,
        data.rendered.sizes
      );

      settings.setbasepath();
      mainWindow.setSelection(s);
    }

    /**
     * Function triggered when listItem selection changes
     */
    function listItem_onChange() {
      if (listItem.selection) {
        aerenderButton.enabled = true;
        playButton.enabled = true;
        batchButton.enabled = true;
        importButton.enabled = true;
        browseButton.enabled = true;
        framesButton.enabled = true;
        versionsIncrement.enabled = true;
        versionsReset.enabled = true;
        versionsDropdown.enabled = true;

        pathcontrol = new Pathcontrol(
          data.item(listItem.selection.index).omItem,
          data.item(listItem.selection.index).rqItem
        );

        cls.prototype.cleardropdown();

        if (pathcontrol.getVersionNumberFromString()) {
          var fsName = settings.getSetting('pathcontrol_fsName');

          if (
            fsName[fsName.length - 1] == '/' ||
            fsName[fsName.length - 1] == '\\'
          ) {
            pathcontrol.setBasepath(
              fsName + data.item(listItem.selection.index).compname
            );
          } else {
            pathcontrol.setBasepath(
              fsName + sep + data.item(listItem.selection.index).compname
            );
          }
          if (pathcontrol.getVersions().length > 0) {
            cls.prototype.setdropdown(pathcontrol.getVersions());
          } else {
            var noVersions = new Folder('No rendered versions found');
            cls.prototype.setdropdown([noVersions]);
          }
        } else {
          var setVersionControl = new Folder('Set Version Control');
          cls.prototype.setdropdown([setVersionControl]);
          pathcontrol.setBasepath(null);
          versionsIncrement.enabled = false;
          versionsReset.enabled = false;
        }
      } else {
        aerenderButton.enabled = false;
        playButton.enabled = false;
        batchButton.enabled = false;
        importButton.enabled = false;
        browseButton.enabled = false;
        framesButton.enabled = false;
        versionsIncrement.enabled = false;
        versionsReset.enabled = false;
        versionsDropdown.enabled = false;
      };
    };

    /**
     * Event triggered when listItem is double-clicked on
     */
    function listItem_onDoubleClick() {
      // app.project.renderQueue.showWindow(true)
      var index = mainWindow.getSelection();
      data.item(index).comp.openInViewer();
    }

    var elemSize = 20;
    var UIsep;
    var UIsepWidth = 10;

    var controlsGroup = palette.add('group');
    controlsGroup.alignment = ['fill', 'fill'];
    controlsGroup.orientation = 'row';

    var controlsGroup1 = controlsGroup.add('group', undefined, {
      name: 'controlsGroup1',
    });
    controlsGroup1.spacing = 10;
    controlsGroup1.alignment = ['left', 'top'];
    controlsGroup1.preferredSize = [300, ''];


    var controlsGroup2 = controlsGroup.add('group', [0, 0, 0, 0], {
      name: 'controlsGroup2',
    });
    controlsGroup2.spacing = 5;
    controlsGroup2.alignment = ['right', 'top'];
    controlsGroup2.preferredSize = [300, ''];

    var aerenderButton = controlsGroup1.add(
      'iconbutton',
      undefined,
      MainWindow_StartRender,
      {
        name: 'aerenderButton',
        style: 'toolbutton',
      }
    );
    aerenderButton.onClick = aerenderButton_onClick;
    aerenderButton.size = [(elemSize * 1.5), elemSize];
    aerenderButton.alignment = 'left';
    aerenderButton.enabled = false;

    var batchButton = controlsGroup1.add(
      'iconbutton',
      undefined,
      MainWindow_SaveRender,
      {
        name: 'aerenderButton',
        style: 'toolbutton',
      }
    );
    batchButton.onClick = batchButton_onClick;
    batchButton.size = [elemSize, elemSize];
    batchButton.alignment = 'left';
    batchButton.enabled = false;

    UIsep = controlsGroup1.add(
      'iconbutton',
      undefined,
      MainWindow_Sep, {
        name: 'aerenderButton',
        style: 'toolbutton',
        enabled: false,
      }
    );
    UIsep.size = [UIsepWidth, elemSize];
    UIsep.enabled = false;

    var playButton = controlsGroup1.add(
      'iconbutton',
      undefined,
      MainWindow_PlayIcon,
      {
        name: 'playButton',
        style: 'toolbutton',
      }
    );
    playButton.onClick = playButton_onClick;
    playButton.size = [elemSize, elemSize];
    playButton.alignment = 'left';
    playButton.enabled = false;


    var browseButton = controlsGroup1.add(
      'iconbutton',
      undefined,
      MainWindow_RevealIcon,
      {
        name: 'browseButton',
        style: 'toolbutton',
      }
    );
    browseButton.onClick = browseButton_onClick;
    browseButton.size = [elemSize, elemSize];
    browseButton.enabled = false;

    var framesButton = controlsGroup1.add(
      'iconbutton',
      undefined,
      MainWindow_FilesIcon,
      {
        name: 'framesButton',
        style: 'toolbutton',
      }
    );
    framesButton.onClick = framesButton_onClick;
    framesButton.size = [elemSize, elemSize];
    framesButton.enabled = false;

    var refreshButton = controlsGroup1.add(
      'iconbutton',
      undefined,
      MainWindow_RefreshIcon,
      {
        name: 'refreshButton',
        style: 'toolbutton',
      }
    );
    refreshButton.onClick = refreshButton_onClick;
    refreshButton.size = [elemSize, elemSize];

    var settingsButton = controlsGroup1.add(
      'iconbutton',
      undefined,
      MainWindow_SettingsIcon, {
      name: 'settingsButton',
      style: 'toolbutton',
    });
    settingsButton.onClick = settingsButton_onClick;
    settingsButton.size = [elemSize, elemSize];
    settingsButton.alignment = 'right';

    UIsep = controlsGroup1.add('iconbutton', undefined, MainWindow_Sep, {
      name: 'aerenderButton',
      style: 'toolbutton',
      enabled: false,
    });
    UIsep.size = [UIsepWidth, elemSize];
    UIsep.enabled = false;

    UIsep = controlsGroup1.add(
      'iconbutton',
      undefined,
      MainWindow_Sep,
      {
        name: 'aerenderButton',
        style: 'toolbutton',
        enabled: false,
      }
    );
    UIsep.size = [UIsepWidth, elemSize];
    UIsep.enabled = false;

    controlsGroup2.add(
      'statictext',
      undefined,
      'Version Control:',
      {
        name: 'versionsLabel',
      }
    );

    var versionsDropdown = controlsGroup2.add(
      'dropdownlist',
      undefined,
      [],
      {
        name: 'versionsDropdown',
      }
    );
    versionsDropdown.size = [60, elemSize];
    versionsDropdown.enabled = false;
    versionsDropdown.onChange = function() {
      versionsDropdown_onChange(versionsDropdown);
    };


    var versionsIncrement = controlsGroup2.add(
      'iconbutton',
      undefined,
      MainWindow_IncrementIcon,
      {
        name: 'versionsIncrement',
        style: 'toolbutton',
      }
    );
    versionsIncrement.onClick = versionsIncrement_onClick;
    versionsIncrement.size = [elemSize, elemSize];
    versionsIncrement.alignment = 'left';
    versionsIncrement.enabled = false;

    var versionsReset = controlsGroup2.add(
      'iconbutton',
      undefined,
      MainWindow_ResetIcon, {
        name: 'versionsReset',
        style: 'toolbutton',
      }
    );
    versionsReset.onClick = versionsReset_onClick;
    versionsReset.size = [elemSize, elemSize];
    versionsReset.alignment = 'left';
    versionsReset.enabled = false;

    var importButton = controlsGroup2.add(
      'iconbutton',
      undefined,
      MainWindow_ImportIcon,
      {
      name: 'importButton',
      style: 'toolbutton',
      }
    );
    importButton.onClick = importButton_onClick;
    importButton.size = [elemSize, elemSize];
    importButton.alignment = 'left';
    importButton.enabled = false;

    var listGroup = palette.add('group', undefined, {
      name: 'listGroup',
      orientation: 'row',
      spacing: 10,
      margins: 10,
    });
    listGroup.size = [0, 0];
    listGroup.alignChildren = 'left';
    listGroup.alignment = 'left';

    var listItem = listGroup.add('listbox', undefined, '', {
      spacing: 0,
      margins: 0,
      name: 'listItem',
      multiselect: false,
      numberOfColumns: inNumColumns,
      showHeaders: true,
      columnTitles: columnTitles,
      columnWidths: columnWidths,
    });
    listItem.size = [0, 0];
    listItem.onChange = listItem.onChanging = listItem_onChange;
    listItem.onDoubleClick = listItem_onDoubleClick;
    return cls;
  }(
    thisObj,
    settings.scriptname,
    6,
    ['Composition', 'Path', 'ΔComplete', 'ΔMissing', 'ΔIncomplete', 'Size'],
    [250, 550, 100, 100, 100, 70]
  );

  var data = new Data;
  var mainWindow = new MainWindow;

  mainWindow.setlist(
    data.compnames,
    data.filenames,
    data.rendered.frames,
    data.missing.frames,
    data.incomplete.frames,
    data.rendered.sizes
  );

  mainWindow.show();

  return this;
})(this);
