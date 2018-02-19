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
    settings.aerender.aerender_bin = null;

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
  function rvHelpButton_onClick() {
    alertScroll('Help: RV Command Line Switches', settings.rv.rv_help);
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
    reveal(folder);
  }

  /**
   * Reveals the currently set root path Control root folder.
   */
  function aerenderExploreButton_onClick() {
    var bin = new Folder(getSetting('aerender_bin'));
    reveal(bin.parent);
  }

  /**
   * Reveals the currently set root path Control root folder.
   */
  function aerenderPickButton_onClick() {
    var aerender = new File('/');
    aerender = aerender.openDlg(
      'Select the location of aerender.exe',
      'aerender.exe:aerender.exe'
    );

    if (aerender) {
      string = aerender.fsName;
    } else {
      string = null;
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
   */
  function rvCallString_onChanged() {
    settings.rv.rv_call = this.text;
    setSetting('rv_call', settings.rv.rv_call);
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
        'Default Render Location',
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
        'Set output path:',
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
        'Pick',
        {
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
        undefined,
        {
          name: 'pathcontrol_basepatternGroup',
        }
      );

      var pathcontrol_fsNameLabel = pathcontrolResultGroup.add(
        'statictext',
        undefined,
        'To set a path relative to the active project you can use\n./  or  ../',
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

      var aerenderPanel = binGroup.add(
        'panel',
        undefined,
        'Aerender.exe',
        {
          borderstyle: 'gray',
          name: 'aerenderPanel',
        }
      );
      aerenderPanel.alignChildren = ['fill', 'fill'];

      var aerender_pathGroup = aerenderPanel.add(
        'group',
        undefined,
        {
          name: 'aerender_basepatternGroup',
        }
      );

      var aerender_fsName = aerender_pathGroup.add(
        'statictext',
        undefined,
        '-',
        {
          name: 'aerender_fsName',
        }
      );
      aerender_fsName.size = [450, 45];

      var aerenderBrowseButton = aerender_pathGroup.add(
        'button',
        undefined,
        'Reveal',
        {
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
        'Pick',
        {
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
      rvHelpButton.onClick = function() {
        try {
          rvHelpButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };

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
      // ====================================================

      var aboutPanel = binGroup.add(
        'panel',
        undefined,
        'About',
        {
          borderStyle: 'gray',
          name: 'aboutPanel',
        }
      );
      aboutPanel.alignChildren = ['left', 'fill'];

      var aboutGroup1 = aboutPanel.add(
        'group',
        undefined,
        {
          name: 'aboutGroup1',
        }
      );

      var info = aboutGroup1.add('statictext', undefined,
      'Version: ' + VERSION + '\n' +
      'Author: ' + AUTHOR + '\n' +
      'Email: ' + EMAIL + '\n',
      {name: 'aboutVersion', multiline: true});
      info.size = [440, 50];

      var aboutWebsite = aboutGroup1.add(
        'button',
        undefined,
        'Website',
        {
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
        'About / Help',
        {
          name: 'aboutReadme',
        }
      );
      aboutReadme.size = [75, 15];
      aboutReadme.onClick = function() {
        openLink('http://gergely-wootsch.com');
      };

      // settings.lastmodified = LAST_MODIFIED;
      // settings.version = VERSION;
      // settings.name = SCRIPT_NAME;
      // settings.author = AUTHOR;
      // settings.email = EMAIL;
      // settings.website = WEBSITE;
      // settings.description = DESCRIPTION;
      // settings.help = HELP;
      // settings.scriptname = SCRIPT_NAME;
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
  };
  return cls;
}(this);
