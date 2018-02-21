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


var MainWindow = function(thisObj, inTitle, inNumColumns, columnTitles, columnWidths) {
  var aerenderButton;
  var playButton;
  var batchButton;
  var stopButton;
  var importButton;
  var browseButton;
  var framesButton;
  var restoreButton;
  var versionsIncrement;
  var versionsReset;
  var versionsDropdown;

  var cls = function() {
    this.createUI = function() {
      palette = thisObj instanceof Panel ? thisObj : new Window(
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

      aerenderButton = controlsGroup1.add(
        'iconbutton',
        undefined,
        ICON_FILES.startRender,
        {
          name: 'aerenderButton',
          style: 'toolbutton',
          toggle: false,
        }
      );
      aerenderButton.onClick = function() {
        try {
          aerenderButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };
      aerenderButton.size = [(elemSize * 1.5), elemSize];
      aerenderButton.alignment = 'left';
      aerenderButton.enabled = false;
      aerenderButton.helpTip = 'Start background render';

      batchButton = controlsGroup1.add(
        'iconbutton',
        undefined,
        ICON_FILES.saveRender,
        {
          name: 'aerenderButton',
          style: 'toolbutton',
          toggle: false,
        }
      );
      batchButton.onClick = function() {
        try {
          batchButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };
      batchButton.size = [elemSize, elemSize];
      batchButton.alignment = 'left';
      batchButton.enabled = false;
      batchButton.helpTip = 'Save a .bat file and start background render';

      stopButton = controlsGroup1.add(
        'iconbutton',
        undefined,
        ICON_FILES.stopRender,
        {
          name: 'stopButton',
          style: 'toolbutton',
          toggle: false,
        }
      );
      stopButton.onClick = function() {
        try {
          stopButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };
      stopButton.size = [elemSize, elemSize];
      stopButton.alignment = 'left';
      stopButton.enabled = true;
      stopButton.helpTip = 'Stop background processes';

      UIsep = controlsGroup1.add(
        'iconbutton',
        undefined,
        ICON_FILES.separator, {
          name: 'aerenderButton',
          style: 'toolbutton',
          enabled: false,
        }
      );
      UIsep.size = [UIsepWidth, elemSize];
      UIsep.enabled = false;

      playButton = controlsGroup1.add(
        'iconbutton',
        undefined,
        ICON_FILES.playButton,
        {
          name: 'playButton',
          style: 'toolbutton',
          toggle: false,
        }
      );
      playButton.onClick = function() {
        try {
          playButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };
      playButton.size = [elemSize, elemSize];
      playButton.alignment = 'left';
      playButton.enabled = false;
      playButton.helpTip = 'Review render output via external player';


      browseButton = controlsGroup1.add(
        'iconbutton',
        undefined,
        ICON_FILES.revealButton,
        {
          name: 'browseButton',
          style: 'toolbutton',
          toggle: false,
        }
      );
      browseButton.onClick = function() {
        try {
          browseButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };
      browseButton.size = [elemSize, elemSize];
      browseButton.enabled = false;
      browseButton.helpTip = 'Reveal render output';

      restoreButton = controlsGroup1.add(
        'iconbutton',
        undefined,
        ICON_FILES.restoreComp2,
        {
          name: 'restoreButton',
          style: 'toolbutton',
          toggle: false,
        }
      );
      restoreButton.onClick = function() {
        try {
          restoreButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };
      restoreButton.size = [elemSize, elemSize];
      restoreButton.enabled = false;
      restoreButton.helpTip = 'Restore the project used to render the current version';

      framesButton = controlsGroup1.add(
        'iconbutton',
        undefined,
        ICON_FILES.framesButton,
        {
          name: 'framesButton',
          style: 'toolbutton',
          toggle: false,
        }
      );
      framesButton.onClick = function() {
        try {
          framesButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };
      framesButton.size = [elemSize, elemSize];
      framesButton.enabled = false;
      framesButton.helpTip = 'Manage rendered files';

      var refreshButton = controlsGroup1.add(
        'iconbutton',
        undefined,
        ICON_FILES.refreshButton,
        {
          name: 'refreshButton',
          style: 'toolbutton',
          toggle: false,
        }
      );
      refreshButton.helpTip = 'Refresh';
      refreshButton.onClick = function() {
        try {
          refreshButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };
      refreshButton.size = [elemSize, elemSize];

      var settingsButton = controlsGroup1.add(
        'iconbutton',
        undefined,
        ICON_FILES.settingsButton,
        {
          name: 'settingsButton',
          style: 'toolbutton',
          toggle: false,
        }
      );
      settingsButton.onClick = function() {
        try {
          settingsButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };
      settingsButton.helpTip = 'Settings';
      settingsButton.size = [elemSize, elemSize];
      settingsButton.alignment = 'right';

      UIsep = controlsGroup1.add('iconbutton', undefined, ICON_FILES.separator, {
        name: 'aerenderButton',
        style: 'toolbutton',
        enabled: false,
      });
      UIsep.size = [UIsepWidth, elemSize];
      UIsep.enabled = false;

      UIsep = controlsGroup1.add(
        'iconbutton',
        undefined,
        ICON_FILES.separator,
        {
          name: 'aerenderButton',
          style: 'toolbutton',
          enabled: false,
        }
      );
      UIsep.size = [UIsepWidth, elemSize];
      UIsep.enabled = false;


      var controlsGroup2 = controlsGroup.add('group', [0, 0, 0, 0], {
        name: 'controlsGroup2',
      });
      controlsGroup2.spacing = 5;
      controlsGroup2.alignment = ['right', 'top'];
      controlsGroup2.preferredSize = [300, ''];

      controlsGroup2.add(
        'statictext',
        undefined,
        'Versions',
        {
          name: 'versionsLabel',
        }
      );

      versionsDropdown = controlsGroup2.add(
        'dropdownlist',
        undefined,
        [],
        {
          name: 'versionsDropdown',
        }
      );
      versionsDropdown.helpTip = 'Choose version number';
      versionsDropdown.size = [60, elemSize];
      versionsDropdown.enabled = false;
      versionsDropdown.onChange = function() {
        try {
          versionsDropdown_onChange(this);
        } catch (e) {
          catchError(e);
        }
      };


      versionsIncrement = controlsGroup2.add(
        'iconbutton',
        undefined,
        ICON_FILES.incrementVersionButton,
        {
          name: 'versionsIncrement',
          style: 'toolbutton',
        }
      );
      versionsIncrement.helpTip = 'Increment version number';
      versionsIncrement.onClick = function() {
        try {
          versionsIncrement_onClick();
        } catch (e) {
          catchError(e);
        }
      };
      versionsIncrement.size = [elemSize, elemSize];
      versionsIncrement.alignment = 'left';
      versionsIncrement.enabled = false;

      versionsReset = controlsGroup2.add(
        'iconbutton',
        undefined,
        ICON_FILES.resetVersionButton, {
          name: 'versionsReset',
          style: 'toolbutton',
        }
      );
      versionsReset.helpTip = 'Reset version number';
      versionsReset.onClick = function() {
        try {
          versionsReset_onClick();
        } catch (e) {
          catchError(e);
        }
      };
      versionsReset.size = [elemSize, elemSize];
      versionsReset.alignment = 'left';
      versionsReset.enabled = false;

      importButton = controlsGroup2.add(
        'iconbutton',
        undefined,
        ICON_FILES.importButton,
        {
        name: 'importButton',
        style: 'toolbutton',
        toggle: false,
        }
      );
      importButton.helpTip = 'Import output into project';
      importButton.onClick = function() {
        try {
          importButton_onClick();
        } catch (e) {
          catchError(e);
        }
      };
      importButton.size = [elemSize, elemSize];
      importButton.alignment = 'left';
      importButton.enabled = false;

      listGroup = palette.add('group', undefined, {
        name: 'listGroup',
        orientation: 'row',
        spacing: 10,
        margins: 10,
      });
      listGroup.size = [0, 0];
      listGroup.alignChildren = 'left';
      listGroup.alignment = 'left';

      listItem = listGroup.add('listbox', undefined, '', {
        spacing: 0,
        margins: 0,
        name: 'listItem',
        multiselect: false,
        numberOfColumns: inNumColumns,
        showHeaders: true,
        columnTitles: columnTitles,
        columnWidths: columnWidths,
      });
      cls.prototype.listItem = listItem;
      listItem.size = [0, 0];
      listItem.onChange = function() {
        try {
          listItem_onChange();
        } catch (e) {
          catchError(e);
        }
      };
      listItem.onDoubleClick = function() {
        try {
          listItem_onDoubleClick();
        } catch (e) {
          catchError(e);
        }
      };
      listItem.onActivate = function() {
        // cls.prototype.refresh();
      };
    }();

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
    listItem: listItem,
    show: function() {
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
          return ICON_FILES.greenIcon;
        }
        if ((renderedCount === duration + 1) && (incompleteCount > 0)) {
          return ICON_FILES.orangeIcon;
        }
        if ((renderedCount < duration + 1) && (renderedCount > 0)) {
          return ICON_FILES.orangeIcon;
        }
        if (incompleteCount > 0) {
          return ICON_FILES.orangeIcon;
        }
        if (missingCount === duration + 1) {
          return ICON_FILES.redIcon;
        }
        return ICON_FILES.grayIcon;
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
      palette.layout.layout(true);
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
      if (!(listItem.selection)) {
        return;
      }

      if (!aerenderOkToStart(data.item(listItem.selection.index).rqIndex)) {
        Window.alert(
          '\'Skip Existing Files\' is available only with ONE output module of type \'Sequence\'',
          SCRIPT_NAME + ': Multiple sequences in Render Queue Item'
        );
        return;
      }

      var omItem = data.getOutputModule(
        data.item(listItem.selection.index).rqIndex,
        data.item(listItem.selection.index).omIndex
      );

      if (omItem === null) {
        cls.prototype.clear();
        refreshButton_onClick();
        return;
      }

      var pathcontrol = new Pathcontrol();
      pathcontrol.initFromOutputModule(omItem);

      var saved;
      var bat;

      try {
        saved = app.project.file.exists;
      } catch (e) {
        saved = false;
      };

      if (!(listItem.selection) && !(saved)) {
        return;
      }

      if (!(saved)) {
        Window.alert(
          'Project is not saved.\nYou must save it before continuing.',
          SCRIPT_NAME + ': Project is not yet saved.'
        );
        return;
      }

      var index = cls.prototype.getSelection();
      var batname = (
        '[' + app.project.file.displayName + ']' +
        '[' + data.item(index).compname + ']' +
        '.bat'
      );

      bat = new File(settings.tempFolder.fullName + '/' + batname);

      app.project.save();

      var aeparchive = new Aeparchives(
        getSetting('pathcontrol_fsName'),
        data.item(index).compname,
        pathcontrol.getVersionString()
      );
      aeparchive.createDir();
      aeparchive.archive();


      omItem.file.parent.create();

      if (promptForFile) {
        bat.changePath(getSetting('pathcontrol_fsName') + sep + batname);
        // var rdir = new File();
        bat = bat.openDlg('Save aerender batch file.', 'Batch:*.bat', false);
      }

      if (bat) {
        var variables = '::' + app.project.file.fsName + '\n' +
          '::' + data.item(index).compname + '\n' +
          'set aerenderPath=' + getSetting('aerender_bin') + '\n' +
          'set project=' + app.project.file.fsName + '\n' +
          'set rqindex=' + data.item(index).rqIndex + '\n' +
          'set output=' + omItem.file.fsName + '\n' +
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
    },

    setSelection: function(index) {
      listItem.selection = index;
      return listItem.selection;
    },

    getSelection: function() {
      var s;
      try {
        s = listItem.selection.index;
      } catch (e) {
        s = null;
      }
      return s;
    },

    refresh: function() {
      var cs = cls.prototype.getSelection();
      data.setData(cs);

      cls.prototype.clear();
      cls.prototype.setlist(
        data.compnames(),
        data.filenames(),
        data.rendered().frames,
        data.missing().frames,
        data.incomplete().frames,
        data.rendered().sizes
      );

      settings.setbasepath();

      cls.prototype.show();
      cls.prototype.setSelection(cs);
    },
  };


  /**
   * Review the selected render output in external player
   */
  function playButton_onClick() {
    if (!(listItem.selection)) {
      return;
    }

    var omItem = data.getOutputModule(
      data.item(listItem.selection.index).rqIndex,
      data.item(listItem.selection.index).omIndex
    );

    if (omItem === null) {
      cls.prototype.clear();
      refreshButton_onClick();
      return;
    }

    var pathcontrol = new Pathcontrol();
    pathcontrol.initFromOutputModule(omItem);

    if (!(listItem.selection)) {
      return;
    }

    var rvPath = getSetting('rv_bin');
    var rvCall = getSetting('rv_call');

    var item = data.item(listItem.selection.index);

    var sequencePath = item.file.fsName;
    var file = new File(settings.tempFolder.fullName + '/_playercall.bat');
    var cmd;

    if (getSetting('rv_bin') === null) {
      Window.alert(
        'RV is selected as the current player but no path has been set.\nCheck the preferences.',
        SCRIPT_NAME
      );
      return;
    }

    if (item.exists.fsNames.length < 1) {
      Window.alert(
        'No frames have been rendered yet.',
        SCRIPT_NAME
      );
      return;
    }

    if (pathcontrol.getPadding() > 0) {
      var rvSequencePath = (
        sequencePath.slice(0, -4).slice(0, -1 * (item.padding + 2)) +
        '%%0' + item.padding + 'd' +
        '.' + item.ext
      );

      var rvRange = item.startframe + '-' + item.endframe;

      cmd = (
        '\"' + getSetting('rv_bin') + '\"' + ' ' +
        '\"' + rvSequencePath + '\"' + ' ' +
        rvRange + ' ' + rvCall
      );
    } else {
      cmd = (
        '\"' + rvPath + '\"' + ' ' + '\"' +
        sequencePath + '\"' + ' ' + rvCall
      );
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

  /**
   * Reveal the selected render output in the explorer
   */
  function browseButton_onClick() {
    var sel = cls.prototype.getSelection();
    if (sel === null) {
      return;
    }

    var index = listItem.selection.index;
    var f = data.item(index).file;
    var p = f.parent;

    reveal(p);
  }

  /**
   * Reveal the selected render output in the explorer
   */
  function restoreButton_onClick() {
    if (!(listItem.selection)) {
      return;
    }

    var omItem = data.getOutputModule(
      data.item(listItem.selection.index).rqIndex,
      data.item(listItem.selection.index).omIndex
    );

    if (omItem === null) {
      cls.prototype.clear();
      refreshButton_onClick();
      return;
    }

    var pathcontrol = new Pathcontrol();
    pathcontrol.initFromOutputModule(omItem);

    if (pathcontrol.getVersion() === null) {
      Window.alert(
        'Version Control has not been set for this output.',
        SCRIPT_NAME
      );
      return;
    }

    var prompt = confirm(
      'Do you want to restore the project used to render \'' + pathcontrol.getVersionString() + '\'?',
      SCRIPT_NAME
    );

    if (!prompt) {
      return;
    }

    var index = cls.prototype.getSelection();
    if (index === null) {
      return;
    }

    var aeparchive = new Aeparchives(
      getSetting('pathcontrol_fsName'),
      data.item(index).compname,
      pathcontrol.getVersionString()
    );

    var archived = new File(aeparchive.getArchivePath());
    if (!(archived.exists)) {
      Window.alert(
        'Could not find an archived project file for the current version.',
        SCRIPT_NAME
      );
      return;
    }

    var saved;
    try {
      saved = app.project.file.exists;
    } catch (e) {
      saved = false;
    };

    if (!(saved)) {
      Window.alert(
        'Project is not saved.\nSave it before restoring an archived version.',
        SCRIPT_NAME + ': Project is not yet saved.'
      );
      return;
    };


    var currentPath = app.project.file.parent.fsName;
    var restoredName = archived.displayName.replace(/^(\[.*\]\s)/i, '');

    var i = 1;
    var newPath = currentPath + sep + restoredName + ' (restored-' + String(i) + ').aep';
    var restored = new File(newPath);

    while (restored.exists) {
      i++;
      newPath = currentPath + sep + restoredName + ' (restored-' + String(i) + ').aep';
      restored.changePath(newPath);
    }

    var c = archived.copy(restored.absoluteURI);
    if (!c) {
      Window.alert('Error restoring project file.', SCRIPT_NAME);
      return;
    }


    var prompt = confirm(
      'Do you want to open the restored project?',
      'Project restored.'
    );

    if (prompt) {
      app.open(restored);
    } else {
      restored.parent.execute();
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
    var keys = [];
    for (var key in data) {
      keys.push(key);
    }

    var cs = cls.prototype.getSelection();

    if (keys.length !== numOutputModules()) {
      cls.prototype.clear();
    }
    cls.prototype.refresh();
    cls.prototype.setSelection(cs);
  };

  /**
   * Opens the frame inspector window
   */
  function framesButton_onClick() {
    if (!(listItem.selection)) {
      return;
    }

    var omItem = data.getOutputModule(
      data.item(listItem.selection.index).rqIndex,
      data.item(listItem.selection.index).omIndex
    );

    if (omItem === null) {
      cls.prototype.clear();
      refreshButton_onClick();
      return;
    }

    var pathcontrol = new Pathcontrol();
    pathcontrol.initFromOutputModule(omItem);

    try {
      if (listItem.selection) {
        var index = listItem.selection.index;

        var frameWindow = new FrameWindow();
        frameWindow.setIndex(index);

        var a = data.item(index).compname;
        var b = (
          'Basepath: ' + '\'' +
          getSetting('pathcontrol_fsName') + '\''
        );
        var c = 'Composition: ' + data.item(index).compname;
        var d = 'Version: ' + (function() {
          if (!pathcontrol.getVersion()) {
            return 'not set';
          } else {
            return pathcontrol.getVersionString();
          }
        }());

        var e = String(omItem.file.fsName);
        var f = data.item(index).exists.names;
        var g = data.item(index).exists.dates;
        var h = data.item(index).exists.sizes;

        frameWindow.show(
          a, b, c, d, e, 3, ['Name', 'Date', 'Size'], f, g, h
        );
      }
    } catch (e) {
      catchError(e);
    }
  }

  /**
   * Starts the background render
   */
  function aerenderButton_onClick() {
    try {
      cls.prototype.aerender(false);
    } catch (e) {
      catchError(e);
    }
  }

  /**
   * Start a batch render and create batch file
   */
  function batchButton_onClick() {
    cls.prototype.aerender(true);
  }

  /**
   * Shos the task manager window.
   */
  function stopButton_onClick() {
    var manager = new Taskmanager();
    var PIDs = manager.getPIDs();

    if (PIDs.length === 0) {
      Window.alert('No background processes running.',
      SCRIPT_NAME
    );
      return;
    } else if (PIDs.length === 1) {
      var call = manager.kill(PIDs[0]);
      Window.alert(call, SCRIPT_NAME);
      return;
    } else {
      var managerWindow = new TaskmanagerWindow(manager);
      managerWindow.show();
      return;
    }
  }

  /**
   * Import render output as footage
   */
  function importButton_onClick() {
    if (!(listItem.selection)) {
      return;
    }

    data.setData(listItem.selection.index);

    var omItem = data.getOutputModule(
      data.item(listItem.selection.index).rqIndex,
      data.item(listItem.selection.index).omIndex
    );

    if (omItem === null) {
      cls.prototype.clear();
      refreshButton_onClick();
      return;
    }

    var pathcontrol = new Pathcontrol();
    pathcontrol.initFromOutputModule(omItem);

    if (listItem.selection) {
      var index = listItem.selection.index;
      if (data.item(index).exists.fsNames.length < 1) {
        Window.alert(
          'No files have been rendered yet.',
          SCRIPT_NAME + ': Unable to import footage'
        );
        return;
      };
      try {
        importFootage(
          data.item(index).exists.fsNames[0],
          true,
          data.item(index).compname,
          pathcontrol.getVersionString()
        );
      } catch (e) {
        catchError(e);
      }
    }
  }

  /**
   * Increments version by one
   */
  function versionsIncrement_onClick() {
    if (!(listItem.selection)) {
      return;
    }

    var cs = cls.prototype.getSelection();

    var omItem = data.getOutputModule(
      data.item(listItem.selection.index).rqIndex,
      data.item(listItem.selection.index).omIndex
    );

    if (omItem === null) {
      cls.prototype.clear();
      refreshButton_onClick();
      return;
    }

    var pathcontrol = new Pathcontrol();
    pathcontrol.initFromOutputModule(omItem);

    pathcontrol.setVersion(pathcontrol.getVersion() + 1);
    pathcontrol.apply(
      data.item(listItem.selection.index)
    );

    data.setData();

    cls.prototype.clear();
    cls.prototype.setlist(
      data.compnames(),
      data.filenames(),
      data.rendered().frames,
      data.missing().frames,
      data.incomplete().frames,
      data.rendered().sizes
    );

    settings.setbasepath();
    cls.prototype.setSelection(cs);
  }

  /**
   * Resets the version to 1
   */
  function versionsReset_onClick() {
    if (!(listItem.selection)) {
      return;
    }

    var cs = cls.prototype.getSelection();

    var omItem = data.getOutputModule(
      data.item(listItem.selection.index).rqIndex,
      data.item(listItem.selection.index).omIndex
    );

    if (omItem === null) {
      cls.prototype.clear();
      refreshButton_onClick();
      return;
    }

    var pathcontrol = new Pathcontrol();
    pathcontrol.initFromOutputModule(omItem);

    pathcontrol.setVersion(1);
    pathcontrol.apply(
      data.item(listItem.selection.index)
    );

    data.setData();

    cls.prototype.clear();
    cls.prototype.setlist(
      data.compnames(),
      data.filenames(),
      data.rendered().frames,
      data.missing().frames,
      data.incomplete().frames,
      data.rendered().sizes
    );

    settings.setbasepath();

    cls.prototype.setSelection(cs);
  }

  /**
   * Event triggered when the dropdown menu selection changes
   * @param  {[type]} versionsDropdown the menu (self)
   */
  function versionsDropdown_onChange(versionsDropdown) {
    var sel = versionsDropdown.selection;

    if (sel === null) {
      return;
    }

    if (!(listItem.selection)) {
      return;
    }

    var fsName = getSetting('pathcontrol_fsName');

    var omItem = data.getOutputModule(
      data.item(listItem.selection.index).rqIndex,
      data.item(listItem.selection.index).omIndex
    );

    if (omItem === null) {
      cls.prototype.clear();
      refreshButton_onClick();
      return;
    }

    var pathcontrol = new Pathcontrol();
    pathcontrol.initFromOutputModule(omItem);

    if (sel.text === 'Set Version Control') {
      setRenderQueueItemDefaults(
        data.item(listItem.selection.index).rqIndex,
        data.item(listItem.selection.index).omIndex,
        pathcontrol
      );

      pathcontrol.setVersion(1);

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
      pathcontrol.apply(
        data.item(listItem.selection.index)
      );
    } else {
      pathcontrol.setVersion(
        getVersionNumberFromString(sel.text)
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
      pathcontrol.apply(
        data.item(listItem.selection.index)
      );
    }

    data.setData();
    var cs = cls.prototype.getSelection();

    cls.prototype.clear();
    cls.prototype.setlist(
      data.compnames(),
      data.filenames(),
      data.rendered().frames,
      data.missing().frames,
      data.incomplete().frames,
      data.rendered().sizes
    );

    settings.setbasepath();

    // cls.prototype.show();
    cls.prototype.setSelection(cs);
  }

  /**
   * Function triggered when listItem selection changes
   */
  function listItem_onChange() {
    if (listItem.selection) {
      aerenderButton.enabled = true;
      batchButton.enabled = true;
      stopButton.enabled = true;
      playButton.enabled = true;
      importButton.enabled = true;
      browseButton.enabled = true;
      restoreButton.enabled = true;
      framesButton.enabled = true;
      versionsIncrement.enabled = true;
      versionsReset.enabled = true;
      versionsDropdown.enabled = true;

      var omItem = data.getOutputModule(
        data.item(listItem.selection.index).rqIndex,
        data.item(listItem.selection.index).omIndex
      );

      if (omItem === null) {
        cls.prototype.clear();
        refreshButton_onClick();
        return;
      }

      var pathcontrol = new Pathcontrol();
      pathcontrol.initFromOutputModule(omItem);


      if (pathcontrol.getVersion()) {
        var fsName = getSetting('pathcontrol_fsName');
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
          cls.prototype.cleardropdown();
          cls.prototype.setdropdown(pathcontrol.getVersions());
        } else {
          var noVersions = new Folder('No rendered versions found');
          cls.prototype.cleardropdown();
          cls.prototype.setdropdown([noVersions]);
        }
      } else {
        var setVersionControl = new Folder('Set Version Control');
        cls.prototype.cleardropdown();
        cls.prototype.setdropdown([setVersionControl]);
        pathcontrol.setBasepath(null);
        versionsIncrement.enabled = false;
        versionsReset.enabled = false;
      }
    } else {
      aerenderButton.enabled = false;
      playButton.enabled = false;
      batchButton.enabled = false;
      stopButton.enabled = true;
      importButton.enabled = false;
      browseButton.enabled = false;
      restoreButton.enabled = false;
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
    var index = mainWindow.getSelection();
    data.item(index).comp.openInViewer();
  }

  return cls;
}(
  thisObj,
  SCRIPT_NAME,
  6,
  ['Composition', 'Path', 'Complete', 'Missing', 'Incomplete', 'Size'],
  [250, 550, 100, 100, 100, 70]
);
