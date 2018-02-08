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

    setSetting('player', settings.player);
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

    setSetting('player', settings.player);
  }

  /**
   * Show rv help
   */
  function rvHelpButton_onClick() {
    alertScroll('Help: RV Command Line Switches', settings.rv.rv_help);
  }

  /**
   * Show djv help
   */
  function djvHelpButton_onClick() {
    alertScroll(
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
    setSetting('rv_call', settings.rv.rv_call);
  }

  /**
   * Saves the custom djvew call string
   */
  function djvCallString_onChanged() {
    settings.djv.djv_call = this.text;
    setSetting('djv_call', settings.djv.djv_call);
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
        'Path to the renders folder:',
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
        'To set a path relative to the active project use\n./  or  ../',
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
