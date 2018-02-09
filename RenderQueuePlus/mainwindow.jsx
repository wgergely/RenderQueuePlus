/**
* Main window
*/
var MainWindow = function(thisObj, inTitle, inNumColumns, columnTitles, columnWidths) {
  var aerenderButton;
  var playButton;
  var batchButton;
  var importButton;
  var browseButton;
  var framesButton;
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
        }
      );
      aerenderButton.onClick = aerenderButton_onClick;
      aerenderButton.size = [(elemSize * 1.5), elemSize];
      aerenderButton.alignment = 'left';
      aerenderButton.enabled = false;

      batchButton = controlsGroup1.add(
        'iconbutton',
        undefined,
        ICON_FILES.saveRender,
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


      browseButton = controlsGroup1.add(
        'iconbutton',
        undefined,
        ICON_FILES.revealButton,
        {
          name: 'browseButton',
          style: 'toolbutton',
        }
      );
      browseButton.onClick = browseButton_onClick;
      browseButton.size = [elemSize, elemSize];
      browseButton.enabled = false;

      framesButton = controlsGroup1.add(
        'iconbutton',
        undefined,
        ICON_FILES.framesButton,
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
        ICON_FILES.refreshButton,
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
        ICON_FILES.settingsButton, {
        name: 'settingsButton',
        style: 'toolbutton',
      });
      settingsButton.onClick = settingsButton_onClick;
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
      versionsDropdown.size = [60, elemSize];
      versionsDropdown.enabled = false;
      versionsDropdown.onChange = function() {
        try {
          versionsDropdown_onChange(versionsDropdown);
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
      versionsIncrement.onClick = versionsIncrement_onClick;
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
      versionsReset.onClick = versionsReset_onClick;
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
        }
      );
      importButton.onClick = importButton_onClick;
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
      listItem.onChange = listItem.onChanging = listItem_onChange;
      listItem.onDoubleClick = listItem_onDoubleClick;
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
    listItem: null,
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
      var omItem = data.getOutputModule(
        data.item(listItem.selection.index).rqIndex,
        data.item(listItem.selection.index).omIndex
      );

      var pathcontrol = new Pathcontrol();
      pathcontrol.initFromOutputModule(omItem);

      var saved;
      var bat;

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
          getSetting('pathcontrol_fsName') + sep +
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
          Window.alert(e, SCRIPT_NAME);
        };


        omItem.file.parent.create();

        if (promptForFile) {
          bat.changePath(app.project.file.parent.fullName + '/' + batname);
          bat = bat.openDlg();
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
      }
      if (!saved) {
        Window.alert(
          'Project is not saved.\nYou must save it before continuing.',
          SCRIPT_NAME + ': Project is not yet saved.'
        );
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

      cls.prototype.show();
      cls.prototype.setSelection(cs);
    },
  };


  /**
   * Review the selected render output in external player
   * @return {[type]} [description]
   */
  function playButton_onClick() {
    var omItem = data.getOutputModule(
      data.item(listItem.selection.index).rqIndex,
      data.item(listItem.selection.index).omIndex
    );

    var pathcontrol = new Pathcontrol();
    pathcontrol.initFromOutputModule(omItem);

    if (listItem.selection) {
      var player = getSetting('player');
      var index = listItem.selection.index;

      var rvPath = getSetting('rv_bin');
      var rvCall = getSetting('rv_call');

      var rvUsePush = getSetting('rv_usepush');
      var rvpushPath = getSetting('rvpush_bin');

      var djvPath = getSetting('djv_bin');
      var djvCall = getSetting('djv_call');
      var item = data.item(index);
      var sequencePath = item.file.fsName;
      var file = new File(settings.tempFolder.fullName + '/_playercall.bat');
      var cmd;

      if (player === 'rv') {
        if (rvPath == 'null' || rvpushPath == 'null') {
          Window.alert(
            'RV or RV Push path is not set. Check preferences.',
            SCRIPT_NAME
          );
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
    try {
      cls.prototype.refresh();
    } catch (e) {
      catchError(e);
    }
  };

  /**
   * Opens the frame inspector window
   */
  function framesButton_onClick() {
    var omItem = data.getOutputModule(
      data.item(listItem.selection.index).rqIndex,
      data.item(listItem.selection.index).omIndex
    );

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
   * Import render output as footage
   */
  function importButton_onClick() {
    var omItem = data.getOutputModule(
      data.item(listItem.selection.index).rqIndex,
      data.item(listItem.selection.index).omIndex
    );

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
    try {
      var cs = cls.prototype.getSelection();

      var omItem = data.getOutputModule(
        data.item(listItem.selection.index).rqIndex,
        data.item(listItem.selection.index).omIndex
      );

      var pathcontrol = new Pathcontrol();
      pathcontrol.initFromOutputModule(omItem);

      pathcontrol.setVersion(pathcontrol.getVersion() + 1);
      pathcontrol.apply(omItem);

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
    } catch (e) {
      alert(e);
    }
  }
  /**
   * Resets the version to 1
   */
  function versionsReset_onClick() {
    var cs = cls.prototype.getSelection();

    var omItem = data.getOutputModule(
      data.item(listItem.selection.index).rqIndex,
      data.item(listItem.selection.index).omIndex
    );
    var pathcontrol = new Pathcontrol();
    pathcontrol.initFromOutputModule(omItem);
    pathcontrol.setVersion(1);
    pathcontrol.apply(omItem);

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
   * Sets the default renderQueue item properties.
   * As of CC 2018 the output module properties are
   * still read-only. Come on Adobe...
   * @param {integer} rqIndex Render Queue item index (1-based).
   * @param {integer} omIndex Render Queue OutputModule index (1-based).
   */
  function setRenderQueueItemDefaults(rqIndex, omIndex) {
    var rqItem = app.project.renderQueue.item(rqIndex);
    var omItem = data.getOutputModule(rqIndex, omIndex);

    rqItem.setSetting('Time Span', 0); // 'Length of the comp'
    rqItem.setSetting('Skip Existing Files', true);
    rqItem.setSetting('Quality', 2); // 'best'
    rqItem.setSetting('Resolution', '1,1'); // 'full' {'x': 1, 'y': 1}

    omItem.setSetting('Video Output', true);
    omItem.setSetting('Use Comp Frame Number', false);
    omItem.setSetting('Starting #', 1);
    omItem.setSetting('Resize', false);
    // omItem.setSetting('Format', 7); // 'PNG' - READ ONLY PROPERTY
    // omItem.setSetting('Channels', 1); // 'RGBA' - READ ONLY PROPERTY
    // omItem.setSetting('Depth', 32); // 'Millions+' - READ ONLY PROPERTY
    // omItem.setSetting('Color', 0); // 'Straight' - READ ONLY PROPERTY
  };

  /**
   * Event triggered when the dropdown menu selection changes
   * @param  {[type]} versionsDropdown the menu (self)
   */
  function versionsDropdown_onChange(versionsDropdown) {
    if (versionsDropdown.selection === null) {
      return;
    }

    var fsName = getSetting('pathcontrol_fsName');

    if (versionsDropdown.selection.text === 'Set Version Control') {
      setRenderQueueItemDefaults(
        data.item(listItem.selection.index).rqIndex,
        data.item(listItem.selection.index).omIndex
      );

      var omItem = data.getOutputModule(
        data.item(listItem.selection.index).rqIndex,
        data.item(listItem.selection.index).omIndex
      );

      var pathcontrol = new Pathcontrol();
      pathcontrol.initFromOutputModule(omItem);

      if (!pathcontrol.getVersion()) {
        pathcontrol.setVersion(1);
        cls.prototype.cleardropdown();

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
        pathcontrol.apply(omItem);
      }
    } else {
      pathcontrol.setVersion(
        getVersionNumberFromString(versionsDropdown.selection.text)
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
      pathcontrol.apply(omItem);
    }

    data.setData();

    var s = mainWindow.getSelection();
    mainWindow.clear();

    mainWindow.setlist(
      data.compnames(),
      data.filenames(),
      data.rendered().frames,
      data.missing().frames,
      data.incomplete().frames,
      data.rendered().sizes
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

      var omItem = data.getOutputModule(
        data.item(listItem.selection.index).rqIndex,
        data.item(listItem.selection.index).omIndex
      );
      var pathcontrol = new Pathcontrol();
      pathcontrol.initFromOutputModule(omItem);

      cls.prototype.cleardropdown();

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
