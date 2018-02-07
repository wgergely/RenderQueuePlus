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
                  SCRIPT_NAME
                );
              }
            } else {
              var text = 'Sorry, there was an error deleteing the file.';
              text += '\nFile doesn\'t exist.';
              Window.alert(
                text,
                SCRIPT_NAME
              );
            }
          }
        }
      } else {
        Window.alert(
          'Select an item from the list below before continuing.',
          SCRIPT_NAME
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
      data.setData();

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
        data.compnames(),
        data.filenames(),
        data.rendered().frames,
        data.missing().frames,
        data.incomplete().frames,
        data.rendered().sizes
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
          if (data.item(index).exists.fsNames.length < 1) {
            Window.alert(
              'No files have been rendered yet.',
              SCRIPT_NAME + ': Unable to import footage'
            );
          };
          try {
            importFootage(
              data.item(index).exists.fsNames[idx],
              false,
              data.item(index).compname,
              pathcontrol.getVersionString()
            );
          } catch (e) {
            Window.alert(e, SCRIPT_NAME);
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
