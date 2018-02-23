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
 * Private convenience function to get an internal setting
 * @param  {string} keyName settings dictinary key
 * @return {object}         value of the setting
 */
function getSetting(keyName) {
  if (app.settings.haveSetting(SCRIPT_NAME, keyName)) {
    return app.settings.getSetting(SCRIPT_NAME, keyName);
  } else {
    return null;
  }
};


/**
 * Private convenience function to set an internal setting
 * @param {string} keyName settings dictinary key
 * @param {object} value   the setting value
 * @return {object}        the set value
 */
function setSetting(keyName, value) {
  app.settings.saveSetting(
    SCRIPT_NAME,
    keyName,
    value
  );
  return app.settings.getSetting(SCRIPT_NAME, keyName);
};


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


/**
 * Settings module.
 *
 * Provides a ui and methods to set and get settings
 * specific to the panel into After Effects.
 */
var Settings = function(thisObj) {
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
  var settingsPalette;

  settings.lastmodified = LAST_MODIFIED;
  settings.version = VERSION;
  settings.name = SCRIPT_NAME;
  settings.author = AUTHOR;
  settings.email = EMAIL;
  settings.website = WEBSITE;
  settings.description = DESCRIPTION;
  settings.help = HELP;
  settings.scriptname = SCRIPT_NAME;

  settings.platform = File.fs;
  settings.version = parseFloat(app.version);
  settings.tempFolder = new Folder(
    Folder.temp.fullName + '/' + settings.scriptname
  );
  settings.tempPath = settings.tempFolder.fsName;

  settings.player = 'rv';

  settings.rv = {};
  var rvHelpFile = new File(
    scriptFile.parent.absoluteURI + '/docs/rvHelp.txt'
  );
  rvHelpFile.open('r');
  settings.rv.rv_help = rvHelpFile.read();
  rvHelpFile.close();

  settings.rv.rv_bin = null;
  settings.rv.rv_call = null;

  settings.aerender = {};
  settings.aerender.fsName = null;
  settings.aerender.aerender_bin = null;

  settings.ffmpeg = {};
  var ffmpegHelpFile = new File(
    scriptFile.parent.absoluteURI + '/docs/ffmpegHelp.txt'
  );
  ffmpegHelpFile.open('r');
  settings.ffmpeg.ffmpeg_help = ffmpegHelpFile.read();
  ffmpegHelpFile.close();
  settings.ffmpeg.fsName = null;
  settings.ffmpeg.ffmpeg_enabled = null;
  settings.ffmpeg.ffmpeg_bin = null;
  settings.ffmpeg.ffmpeg_call = null;

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
   * Show rv help
   */
  function ffmpeg_helpButton_onClick() {
    alertScroll('Help: FFmpeg Command Line Switches', settings.ffmpeg.ffmpeg_help);
  }

  /**
   * Show rv help
   */
  function rvHelpButton_onClick() {
    alertScroll('Help: RV Command Line Switches', settings.rv.rv_help);
  }

  /**
   * Sets the default root path for Path Control.
   */
  function pathcontrolPickButton_onClick() {
    var folder = new Folder(settings.pathcontrol.fsName);
    folder = folder.selectDlg('Select new render folder location');

    if (!folder) {
      return;
    }

    settings.pathcontrol.basepattern = folder.fsName;
    settings.pathcontrol.fsName = folder.fsName;
    setSetting('pathcontrol_fsName', settings.pathcontrol.fsName);
    setSetting('pathcontrol_basepattern', settings.pathcontrol.fsName);

    setUIString('pathcontrol_fsName', settings.pathcontrol.fsName);
    setUIString('pathcontrol_basepattern', settings.pathcontrol.fsName);
  }

  /**
   * Reveals the currently set root path Control root folder.
   */
  function pathcontrolExploreButton_onClick() {
    var folder = new Folder(settings.pathcontrol.fsName);
    reveal(folder);
  }


  /**
   * Reveals the currently set root path Control root folder.
   */
  function ffmpegExploreButton_onClick() {
    var bin = new Folder(getSetting('ffmpeg_bin'));

    if (!bin.exists) {
      Window.alert(
        'Couldn\'t find the item.',
        SCRIPT_NAME + ': Item could not be found'
      );
      return;
    }

    try {
      if (bin.parent.exists) {
        reveal(bin.parent);
      }
    } catch (e) {
      return;
    }
  }

  /**
   * Sets the ffmpeg_bin.
   */
  function ffmpegPickButton_onClick() {
    var ffmpeg = new File('/');
    ffmpeg = ffmpeg.openDlg(
      'Select the location of the ffmpeg.exe',
      'ffmpeg.exe:ffmpeg.exe'
    );

    if (!ffmpeg) {
      return;
    };

    settings.ffmpeg.fsName = ffmpeg.fsName;
    setSetting('ffmpeg_bin', settings.ffmpeg.fsName);
    setUIString(
      'ffmpeg_fsName',
      ellipsis2(getSetting('ffmpeg_bin'))
    );
  };

  /**
   * Reveals the currently set root path Control root folder.
   */
  function aerenderExploreButton_onClick() {
    var bin = new Folder(getSetting('aerender_bin'));

    if (!bin.exists) {
      Window.alert(
        'Couldn\'t find the item.',
        SCRIPT_NAME + ': Item could not be found'
      );
      return;
    }

    try {
      if (bin.parent.exists) {
        reveal(bin.parent);
      }
    } catch (e) {
      return;
    }
  }

  /**
   * Sets the aerender bin.
   */
  function aerenderPickButton_onClick() {
    var aerender = new File('/');
    aerender = aerender.openDlg(
      'Select the location of aerender.exe',
      'aerender.exe:aerender.exe'
    );

    if (!aerender) {
      return;
    };

    settings.aerender.fsName = aerender.fsName;
    setSetting('aerender_bin', settings.aerender.fsName);
    setUIString(
      'aerender_fsName',
      ellipsis2(getSetting('aerender_bin'))
    );
  };

  /**
   * Saves the custom rv call string
   * @param {String} text
   */
  function rvCallString_onChanged(text) {
    settings.rv.rv_call = text;
    setSetting('rv_call', settings.rv.rv_call);
  }

  /**
   * Saves the custom ffmpeg call string
   * @param {String} text
   */
  function ffmpeg_callString_onChanged(text) {
    settings.ffmpeg.ffmpeg_call = text;
    setSetting('ffmpeg_call', settings.ffmpeg.ffmpeg_call);
  }

  /**
   * Saves the custom rv call string
   * @param {Boolean} value The value of the checkbox
   */
  function ffmpeg_enabled_onChange(value) {
    settings.ffmpeg.ffmpeg_enabled = value;
    setSetting('ffmpeg_enabled', settings.ffmpeg.ffmpeg_enabled);
  }

  /**
   * Expands the input pattern and sets it as a new base path.
   * @param {String} text
   */
  function pathcontrol_basepattern_onChanged(text) {
    settings.pathcontrol.basepattern = text;
    setSetting('pathcontrol_basepattern', settings.pathcontrol.basepattern);
    setBasebath();
  }

  /**
   * Sets the text for the given ui element
   * @param {string} inName name of the ui element
   * @param {string} inText text to display
   */
  function setUIString(inName, inText) {
    settingsPalette.findElement(inName).text = inText;
  };

  /**
   * Sets the basepath base on an input string
   * automatically expanding any relative pointers to
   * absolute paths
   */
  function setBasebath() {
    var saved;
    var folder = new Folder('/');
    var desktop = new Folder(Folder.desktop.fsName + sep + 'RenderQueue+');

    /**
     * Private convenience function
     * @param {String} s string to set and display
     */
    function set(s) {
      settings.pathcontrol.fsName = s;
      setSetting('pathcontrol_fsName', s);
      setUIString('pathcontrol_fsName', s);
    }

    // If no pattern set default to desktop
    settings.pathcontrol.basepattern = settings.pathcontrol.basepattern.
    replace(/^([^a-zA-Z0-9\.]{1,})/g, '');

    if (settings.pathcontrol.basepattern === '') {
      set(desktop.fsName);
      return;
    } else if (settings.pathcontrol.basepattern === '.') {
      set(desktop.fsName);
      return;
    } else if (settings.pathcontrol.basepattern === '..') {
      set(desktop.fsName);
      return;
    } else if (settings.pathcontrol.basepattern === '/') {
      set(desktop.fsName);
      return;
    } else if (settings.pathcontrol.basepattern === '\\') {
      set(desktop.fsName);
      return;
    }

    try {
      saved = app.project.file.exists;
    } catch (e) {
      saved = false;
    }

    var errorString = 'Project is not saved. ';
    errorString += 'Unable to set path relative to project location.';

    /**
     * Private.
     * @param  {[type]} s [description]
     * @param  {[type]} numParents [description]
     * @return {[type]}   [description]
     */
    function getAbsolutePath(s, numParents) {
      var parent = app.project.file;
      for (var i = 0; i < numParents; i++) {
        if (parent.parent === null) {
          break;
        }
        parent = parent.parent;
      }
      s = s.replace(/\.\//gi, '') + sep;
      if (numParents > 0) {
        s = parent.fsName + sep + s;
      } else {
        return app.project.file.parent.fsName;
      }
      s = s.replace(/(\\){1,}|(\/){1,}/gi, sep);
      return s;
    }

    /**
     * Number of parents in basepath
     * @param  {String} s basepath
     * @return {Number}   number of parents
     */
    function getNumParents(s) {
      var numParents = 0;
      if (/\.\//g.test(s)) {
        numParents = s.match(/\.\//g || []).length;
      }
      return numParents;
    }

    /**
     * Private convencience function to normalize a path.
     * @param  {String} s input string
     * @return {String}   file path
     */
    function getNormBasepath(s) {
      var re0 = /\\/gi; // forward slashes
      var re1 = /\.\.\//gi; // grandparents
      var re2 = /\.\//gi; // parents
      var re3 = /^[a-z0-9\s]/gi; // alpha-numberic and whitespace characters at the start
      var re4 = /\.{2,}/gi; // multiple dots
      // normalize path
      s = s.
      replace(re0, '/').
      replace(re1, '././').
      replace(re4, '.');
      // if the string contains relative pointers
      // remove any characters preceeding them
      if (re2.test(s)) {
        if (re3.test(s)) {
          s = s.replace(re3, '');
        }
      }
      return s;
    }

    // Set
    if (saved) {
      var normBasepath = getNormBasepath(settings.pathcontrol.basepattern);
      var numParents = getNumParents(normBasepath);

      if (numParents === 0) {
        folder.changePath(settings.pathcontrol.basepattern);
        set(folder.fsName);
        return;
      }
      var absolutePath = getAbsolutePath(normBasepath, numParents);

      set(absolutePath);
      setUIString('pathcontrol_basepattern', normBasepath);

      folder.changePath(absolutePath);
      set(folder.fsName);
      return;
    } else {
      folder.changePath(settings.pathcontrol.basepattern);
      if (folder.exists) {
        set(folder.fsName);
        return;
      } else {
        set(folder.fsName);
        return;
      };
    }
  };

  // Set Settings from Saved Preferences
  settings.init = function() {
    settings.player = getSetting('player');

    settings.rv.rv_bin = getSetting('rv_bin');
    settings.rv.rv_call = getSetting('rv_call');
    if (!settings.rv.rv_call) {
      settings.rv.rv_call = '';
      setSetting('rv_call', '');
    }

    settings.aerender.aerender_bin = function() {
      var aerender = new File('/');

      if (getSetting('aerender_bin')) {
        aerender.changePath(getSetting('aerender_bin'));
        if (aerender.exists) {
          setSetting('aerender_bin', aerender.fsName);
          return;
        }
      }

      var version = parseFloat(app.version);
      var string;

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

      if (aerender.exists) {
        string = aerender.fsName;
      } else {
        var text = 'Aerender.exe could not be located.\n';
        text += 'Do you want to manually select it?';

        var prompt = confirm(
          text,
          'Where is aerender.exe?'
        );

        if (prompt) {
          aerender = aerender.openDlg(
            'Select the location of aerender.exe',
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

    settings.pathcontrol.basepattern = getSetting('pathcontrol_basepattern');
    if (!settings.pathcontrol.basepattern) {
      settings.pathcontrol.basepattern = '';
      setSetting('pathcontrol_basepattern', '');
    }
    settings.pathcontrol.fsName = getSetting('pathcontrol_fsName');
  }();

  var cls = function() {
    var cls = this;

    this.createUI = function(cls) {
      settingsPalette = thisObj instanceof Panel ? thisObj : new Window(
        'palette',
        settings.scriptname + ': Settings',
        undefined, {
          resizeable: false,
        }
      );

      if (settingsPalette === null) return;

      settingsPalette.margins = 20;
      settingsPalette.spacing = 20;

      var binGroup = settingsPalette.add(
        'group',
        undefined, {
          name: 'binGroup',
        }
      );
      binGroup.orientation = 'column';

      // ====================================================

      var pathcontrolPanel = binGroup.add(
        'panel',
        undefined,
        'Default Render Location', {
          borderstyle: 'gray',
          name: 'pathcontrolPanel',
        }
      );
      pathcontrolPanel.alignChildren = ['fill', 'fill'];

      var pathcontrol_basepatternGroup = pathcontrolPanel.add(
        'group',
        undefined, {
          name: 'pathcontrol_basepatternGroup',
        }
      );

      var pathcontrol_basepatternHeader = pathcontrol_basepatternGroup.add(
        'statictext',
        undefined,
        'Set output path:', {
          name: 'pathcontrol_basepatternHeader',
        }
      );
      pathcontrol_basepatternHeader.size = [150, 25];

      var pathcontrol_basepattern = pathcontrol_basepatternGroup.add(
        'edittext',
        undefined,
        '', {
          name: 'pathcontrol_basepattern',
        }
      );
      pathcontrol_basepattern.size = [290, 25];
      pathcontrol_basepattern.onChange = pathcontrol_basepattern.onChanging = function() {
        try {
          pathcontrol_basepattern_onChanged(this.text);
        } catch (e) {
          catchError(e);
        }
      };

      var pathcontrolBrowseButton = pathcontrol_basepatternGroup.add(
        'button',
        undefined,
        'Reveal', {
          name: 'pathcontrolExploreButton',
        }
      );
      pathcontrolBrowseButton.size = [70, 25];
      pathcontrolBrowseButton.onClick = function() {
        try {
          pathcontrolExploreButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };

      var pathcontrolHelpButton = pathcontrol_basepatternGroup.add(
        'button',
        undefined,
        'Pick', {
          name: 'pathcontrolPickButton',
        }
      );
      pathcontrolHelpButton.size = [70, 25];
      pathcontrolHelpButton.onClick = function() {
        try {
          pathcontrolPickButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };

      var pathcontrolResultGroup = pathcontrolPanel.add(
        'group',
        undefined, {
          name: 'pathcontrol_basepatternGroup',
        }
      );

      var pathcontrol_fsNameLabel = pathcontrolResultGroup.add(
        'statictext',
        undefined,
        'To set a path relative to the active project you can use\n./  or  ../', {
          name: 'pathcontrol_fsNameLabel',
          multiline: true,
        }
      );
      pathcontrol_fsNameLabel.size = [150, 45];

      var pathcontrol_fsName = pathcontrolResultGroup.add(
        'statictext',
        undefined,
        'No pattern has been set.', {
          name: 'pathcontrol_fsName',
        }
      );
      pathcontrol_fsName.size = [450, 45];

      // ====================================================

      var aerenderPanel = binGroup.add(
        'panel',
        undefined,
        'Aerender.exe', {
          borderstyle: 'gray',
          name: 'aerenderPanel',
        }
      );
      aerenderPanel.alignChildren = ['fill', 'fill'];

      var aerender_pathGroup = aerenderPanel.add(
        'group',
        undefined, {
          name: 'aerender_basepatternGroup',
        }
      );

      var aerender_fsName = aerender_pathGroup.add(
        'statictext',
        undefined,
        '-', {
          name: 'aerender_fsName',
        }
      );
      aerender_fsName.size = [450, 45];

      var aerenderBrowseButton = aerender_pathGroup.add(
        'button',
        undefined,
        'Reveal', {
          name: 'aerenderExploreButton',
        }
      );
      aerenderBrowseButton.size = [70, 25];
      aerenderBrowseButton.onClick = function() {
        try {
          aerenderExploreButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };

      var aerenderPickButton = aerender_pathGroup.add(
        'button',
        undefined,
        'Pick', {
          name: 'aerenderPickButton',
        }
      );
      aerenderPickButton.size = [70, 25];
      aerenderPickButton.onClick = function() {
        try {
          aerenderPickButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };

      // ====================================================

      var ffmpegPanel = binGroup.add(
        'panel',
        undefined,
        'FFmpeg', {
          borderstyle: 'gray',
          name: 'ffmpegPanel',
        }
      );
      ffmpegPanel.alignChildren = ['fill', 'fill'];

      var ffmpeg_pathGroup = ffmpegPanel.add(
        'group',
        undefined, {
          name: 'ffmpeg_pathGroup',
        }
      );

      var ffmpeg_fsName = ffmpeg_pathGroup.add(
        'statictext',
        undefined,
        '-', {
          name: 'ffmpeg_fsName',
        }
      );
      ffmpeg_fsName.size = [450, 45];

      var ffmpegBrowseButton = ffmpeg_pathGroup.add(
        'button',
        undefined,
        'Reveal', {
          name: 'ffmpegExploreButton',
        }
      );
      ffmpegBrowseButton.size = [70, 25];
      ffmpegBrowseButton.onClick = function() {
        try {
          ffmpegExploreButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };

      var ffmpegPickButton = ffmpeg_pathGroup.add(
        'button',
        undefined,
        'Pick', {
          name: 'ffmpegPickButton',
        }
      );
      ffmpegPickButton.size = [70, 25];
      ffmpegPickButton.onClick = function() {
        try {
          ffmpegPickButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };

      var ffmpeg_createGroup = ffmpegPanel.add(
        'group',
        undefined, {
          name: 'ffmpeg_createGroup',
        }
      );
      ffmpeg_createGroup.orientation = 'row';


      var ffmpeg_enabled = ffmpeg_createGroup.add(
        'checkbox',
        undefined,
        'Create QuickTime', {
          name: 'ffmpeg_enabled',
        }
      );
      ffmpeg_enabled.size = [150, 25];
      ffmpeg_enabled.onClick = function() {
        try {
          ffmpeg_enabled_onChange(this.value);
        } catch (e) {
          catchError(e);
        }
      };

      var ffmpeg_callString = ffmpeg_createGroup.add(
        'edittext',
        undefined,
        '-vcodec libx264 -crf 12 -pix_fmt yuv420p', {
          name: 'ffmpeg_callString',
        }
      );
      ffmpeg_callString.size = [290, 25];
      ffmpeg_callString.onChange = ffmpeg_callString.onChanged = function() {
        try {
          ffmpeg_callString_onChanged(this.text);
        } catch (e) {
          catchError(e);
        }
      };

      var ffmpeg_helpButton = ffmpeg_createGroup.add(
        'button',
        undefined,
        'Help', {
          name: 'ffmpeg_helpButton',
        }
      );
      ffmpeg_helpButton.size = [150, 25];
      ffmpeg_helpButton.onClick = function() {
        try {
          ffmpeg_helpButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };

      // ====================================================

      var rvPanel = binGroup.add(
        'panel',
        undefined,
        'RV', {
          borderStyle: 'gray',
          name: 'rvPanel',
        }
      );
      rvPanel.alignChildren = ['fill', 'fill'];

      var rvCallStringGroup = rvPanel.add(
        'group',
        undefined, {
          name: 'rvCallStringGroup',
        }
      );
      rvCallStringGroup.orientation = 'row';

      var rvCallStringHeader = rvCallStringGroup.add(
        'statictext',
        undefined,
        'Custom switches', {
          name: 'rvCallStringHeader',
        }
      );
      rvCallStringHeader.size = [150, 25];

      var rvCallString = rvCallStringGroup.add(
        'edittext',
        undefined,
        '', {
          name: 'rvCallString',
        }
      );
      rvCallString.size = [290, 25];
      rvCallString.onChange = rvCallString.onChanged = function() {
        try {
          rvCallString_onChanged(this.text);
        } catch (e) {
          catchError(e);
        }
      };

      var rvHelpButton = rvCallStringGroup.add(
        'button',
        undefined,
        'Help', {
          name: 'rvHelpButton',
        }
      );
      rvHelpButton.size = [150, 25];
      rvHelpButton.onClick = function() {
        try {
          rvHelpButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };

      var rvGroup = rvPanel.add(
        'group',
        undefined, {
          name: 'rvGroup',
        }
      );
      rvGroup.orientation = 'row';

      var pickRVButton = rvGroup.add(
        'button',
        undefined,
        'Set RV Path', {
          name: 'pickRVButton',
        }
      );
      pickRVButton.size = [150, 25];
      pickRVButton.onClick = function() {
        try {
          pickRVButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };

      var rvPickString = rvGroup.add(
        'statictext',
        undefined,
        'path not set', {
          name: 'rvPickString',
        }
      );
      rvPickString.enabled = false;
      rvPickString.graphics.foregroundColor = rvPickString.graphics.newPen(
        settingsPalette.graphics.PenType.SOLID_COLOR, [0.7, 0.7, 0.7],
        1
      );
      rvPickString.alignment = 'right';
      rvPickString.size = [450, 25];
      // ====================================================

      var aboutPanel = binGroup.add(
        'panel',
        undefined,
        'About', {
          borderStyle: 'gray',
          name: 'aboutPanel',
        }
      );
      aboutPanel.alignChildren = ['left', 'fill'];

      var aboutGroup1 = aboutPanel.add(
        'group',
        undefined, {
          name: 'aboutGroup1',
        }
      );

      var info = aboutGroup1.add('statictext', undefined,
        'Version: ' + VERSION + '\n' +
        'Author: ' + AUTHOR + '\n' +
        'Email: ' + EMAIL + '\n', {
          name: 'aboutVersion',
          multiline: true,
        });
      info.size = [440, 50];

      var aboutWebsite = aboutGroup1.add(
        'button',
        undefined,
        'Website', {
          name: 'aboutWebsite',
        }
      );
      aboutWebsite.size = [75, 15];
      aboutWebsite.onClick = function() {
        openLink('http://gergely-wootsch.com');
      };

      var aboutReadme = aboutGroup1.add(
        'button',
        undefined,
        'About / Help', {
          name: 'aboutReadme',
        }
      );
      aboutReadme.size = [75, 15];
      aboutReadme.onClick = function() {
        openLink('http://gergely-wootsch.com');
      };

      var closeBtn = settingsPalette.add(
        'button',
        undefined,
        'Close', {
          name: 'ok',
        }
      );
      closeBtn.onClick = function() {
        var folder = new Folder(getSetting('pathcontrol_fsName'));
        if (!folder.exists) {
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
        settingsPalette.hide();
      };
    }(cls);

    this.show = function() {
      if (settings.player == 'rv') {
        settingsPalette.findElement('rvPanel').enabled = true;
      }

      if (!getSetting('rv_bin')) {
        setUIString('rvPickString', 'Path not set.');
      } else {
        setUIString(
          'rvPickString',
          '\'' + getSetting('rv_bin') + '\''
        );
      }

      if (!getSetting('rv_call')) {
        setUIString('rvCallString', '');
      } else {
        setUIString('rvCallString', getSetting('rv_call'));
      }

      setUIString(
        'pathcontrol_basepattern',
        getSetting('pathcontrol_basepattern')
      );

      if (!(getSetting('pathcontrol_fsName') === '')) {
        setUIString(
          'pathcontrol_fsName',
          ellipsis2(getSetting('pathcontrol_fsName'))
        );
      } else {
        setUIString('pathcontrol_fsName', 'No pattern has been set.');
      }

      if (getSetting('aerender_bin')) {
        var aerender_bin = new File(getSetting('aerender_bin'));
        if (aerender_bin.exists) {
          setUIString(
            'aerender_fsName',
            ellipsis2(getSetting('aerender_bin'))
          );
        } else {
          setUIString(
            'aerender_fsName',
            aerender_bin.parent.displayName + '/' + aerender_bin.displayName + ' does not exists.'
          );
        }
      } else {
        setUIString(
          'aerender_fsName',
          'aerender has not been set.'
        );
      }

      if (getSetting('ffmpeg_bin')) {
        var ffmpeg_bin = new File(getSetting('ffmpeg_bin'));
        if (ffmpeg_bin.exists) {
          setUIString(
            'ffmpeg_fsName',
            ellipsis2(getSetting('ffmpeg_bin'))
          );
        } else {
          setUIString(
            'ffmpeg_fsName',
            ffmpeg_bin.parent.displayName + '/' + ffmpeg_bin.displayName + ' does not exists.'
          );
        }
      } else {
        setUIString(
          'ffmpeg_fsName',
          'ffmpeg has not been set.'
        );
      }

      if (getSetting('ffmpeg_call')) {
        setUIString('ffmpeg_callString', getSetting('ffmpeg_call'));
      }

      var ffmpeg_enabled = settingsPalette.findElement('ffmpeg_enabled');
      if (getSetting('ffmpeg_enabled')) {
        if (getSetting('ffmpeg_enabled') === 'true') {
          ffmpeg_enabled.value = true;
        } else if (getSetting('ffmpeg_enabled') === 'false') {
          ffmpeg_enabled.value;
        }
      } else {
        setSetting('ffmpeg_enabled', 'true');
        ffmpeg_enabled.value = true;
      }

      settingsPalette.layout.layout(true);
      settingsPalette.layout.resize();
      if (!(settingsPalette instanceof Panel)) {
        settingsPalette.show();
      }
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

    this.setbasepath();
  };
  return cls;
}(this);
