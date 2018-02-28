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


var FrameWindow = function() {
  var initX = 600;
  var state = false;
  var index;

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

    var filterText = cls.prototype.searchField.text;

    if (inColumn1.length > 0) {
      for (var i = 0; i < inColumn1.length; i++) {
        if (!((inColumn1[i] == 'Error.') || (inColumn1[i] == 'Invalid path.'))) {
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
          item = listItem.add('item', 'No items found.');
          listGroup.enabled = false;
          break;
        }
      }
    } else {
      item = listItem.add('item', 'No items found.');
      listGroup.enabled = false;
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
      resizeable: true,
    });
    w.alignChildren = 'center';
    w.margins = 18;
    w.spacing = 6;

    /**
     * Called when the window is closed
     */
    function button_cancel_onClick() {
      w.close();
      w = undefined;
      mainWindow.refresh();
    }

    /**
     * Deletes the selected frames
     */
    function deleteButton_onClick() {
      var listItem = w.findElement('listItem');
      var cs = mainWindow.getSelection();

      if (!(listItem.selection)) {
        return;
      }

      var text = 'Are you sure you want to delete the selected files?';
      text += '\n\nThis cannot be undone.';
      var choice = confirm(
        text,
        true,
        'Confirm Delete'
      );

      if (!(choice)) {
        return;
      }

      var file = new File('/c/temp01234.tmp');
      var result;
      var sel = listItem.selection;
      var existingFiles;
      var idx;
      var text = 'Sorry, there was an error deleting the file.';

      for (var i = 0; i < sel.length; i++) {
        existingFiles = data.item(index).exists;
        idx = existingFiles.names.indexOf(sel[i].text);
        file.changePath(existingFiles.fsNames[idx]);

        if (!(file.exists)) {
          continue;
        }

        result = file.remove();

        if (result) {
          sel[i].enabled = false;
          sel[i].text = 'Deleted.';
        } else {
          sel[i].text = text;
        }
      }
      data.setData(cs);
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
      var cs = mainWindow.getSelection();
      data.setData(cs);

      searchfield_onChanged(searchField.text);

      mainWindow.clear();
      mainWindow.setlist(
        data.compnames(),
        data.displayNames(),
        data.rendered().frames,
        data.missing().frames,
        data.incomplete().frames,
        data.rendered().sizes
      );
      mainWindow.setSelection(cs);
      settings.setbasepath();
    };

    /**
     * Action called upon clicking the import button.
     * @return {[type]} the imported footage item
     */
    function importButton_onClick() {
      var index = mainWindow.getSelection();
      var listItem = w.findElement('listItem');
      var omItem = data.getOutputModule(
        data.item(index).rqIndex,
        data.item(index).omIndex
      );

      var pathcontrol = new Pathcontrol();
      pathcontrol.initFromOutputModule(omItem);

      if (!(listItem.selection)) {
        return;
      }

      for (var i = 0; i < listItem.selection.length; i++) {
        idx = listItem.selection[i].index;
        if (data.item(index).exists.fsNames.length < 1) {
          Window.alert(
            'No files have been rendered yet.',
            SCRIPT_NAME + ': Unable to import footage'
          );
        };
        var footage = importFootage(
          data.item(index).exists.fsNames[idx],
          false,
          data.item(index).compname,
          pathcontrol.getVersionString()
        );
        footage.openInViewer();
        return footage;
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
      ICON_FILES.redbin,
      {
        name: 'deleteButton',
      }
    );
    deleteButton.size = [elemSize, elemSize];
    deleteButton.helpTip = 'Delete selected file(s)';
    deleteButton.onClick = function() {
      try {
        deleteButton_onClick();
      } catch (e) {
        catchError(e);
      }
    };

    var sep = controlsGroup.add(
      'iconbutton',
      undefined,
      ICON_FILES.separator,
      {
        style: 'toolbutton',
      }
    );
    sep.enabled = false;
    sep.size = [1, elemSize];

    var browseButton = controlsGroup.add(
      'iconbutton',
      undefined,
      ICON_FILES.revealButton,
      {
        name: 'browseButton',
        style: 'toolbutton',
      }
    );
    browseButton.helpTip = 'Reveal in explorer';
    browseButton.onClick = function() {
      try {
        browseButton_onClick();
      } catch (e) {
        catchError(e);
      }
    };
    browseButton.size = [elemSize, elemSize];

    var importButton = controlsGroup.add(
      'iconbutton',
      undefined,
      ICON_FILES.importButton,
      {
        name: 'importButton',
        style: 'toolbutton',
      }
    );
    importButton.helpTip = 'Import selected file(s) to project';
    importButton.onClick = function() {
      try {
        importButton_onClick();
      } catch (e) {
        catchError(e);
      }
    };
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
    incompleteButton.helpTip = 'Show incomplete or empty files';
    incompleteButton.onClick = function() {
      try {
        incompleteButton_onClick();
      } catch (e) {
        catchError(e);
      }
    };
    incompleteButton.size = [115, elemSize];

    var refreshButton = controlsGroup.add(
      'iconbutton',
      undefined,
      ICON_FILES.refreshButton,
      {
        name: 'refreshButton',
        style: 'toolbutton',
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

    var sep1 = w.add(
      'group',
      undefined,
      {
        name: 'sep1',
        orientation: 'row',
      }
    );
    sep1.size = [20, 20];

    var searchGroup = w.add('group', undefined, {
      name: 'searchGroup',
      orientation: 'row',
    });
    searchGroup.alignChildren = ['left', 'top'];
    searchGroup.margins = [0, 0, 0, 0];
    searchGroup.spacing = 0;

    var searchSubGroup = searchGroup.add('group', undefined, {
      name: 'searchSubGroup',
      orientation: 'column',
    });


    var searchInfoField = searchSubGroup.add(
      'statictext',
      undefined,
      'Filter list (eg. \'1-20\'  or  \'1-20, 25, 30\')',
      {
        name: 'searchInfoField',
      }
    );
    searchSubGroup.margins = [0, 0, 0, 0];
    searchSubGroup.spacing = 0;

    var searchField = searchSubGroup.add(
      'edittext',
      undefined,
      '',
      {
        multiline: false,
        name: 'searchField',
      }
    );
    searchField.helpTip = 'Filter the list of files by entering a range, eg. 1-100,\n' +
    'and/or numbers separated by comas, eg. 1,2,3,8';
    cls.prototype.searchField = searchField;

    var searchButton = searchSubGroup.add('button', undefined, 'Filter', {
      name: 'button_filter',
    });
    searchButton.onClick = function() {
      try {
        searchfield_onChanged(searchField.text);
      } catch (e) {
        catchError(e);
      }
    };

    /**
     * Filters the list of frames by the given range.
     * @param  {[type]} text [description]
     */
    function searchfield_onChanged(text) {
      text = text.replace(/([^0-9,-]+)/gi, '');
      text = text.replace(/,{2,}/g, ',');

      var listItem = w.findElement('listItem');

      if (text.length === 0) {
        listItem.removeAll();
        setlist(
          w,
          3,
          data.item(index).exists.names,
          data.item(index).exists.dates,
          data.item(index).exists.sizes
        );
        return;
      }

      var item = data.item(mainWindow.getSelection());
      var d = getArrayFromRange(text, item.duration);

      var keys = [];
      var key;
      for (key in d) {
        keys.push(key);
      }

      if (keys.length === 0) {
        return;
      }

      var frameId;
      var filteredNames = [];
      var filteredDates = [];
      var filteredSizes = [];

      for (var i = 0; i < item.exists.names.length; i++) {
        frameId = parseInt(getFrameNumberFromName(item.exists.names[i]), 10);
        if (d.hasOwnProperty(frameId)) {
          filteredNames.push(item.exists.names[i]);
          filteredDates.push(item.exists.dates[i]);
          filteredSizes.push(item.exists.sizes[i]);
        }
      }

      if (filteredNames.length > 0) {
        listItem.removeAll();
        try {
          setlist(
            w,
            3,
            filteredNames,
            filteredDates,
            filteredSizes
          );
        } catch (e) {
          if (e.message === 'Object is invalid') {
            listItem.removeAll();
            setlist(
              w,
              3,
              filteredNames,
              filteredDates,
              filteredSizes
            );
            return;
          }
        }
      }
    };

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
      if (!(listItem.selection)) {
        return;
      }

      var existingFiles = data.item(index).exists;
      var idx = existingFiles.names.indexOf(listItem.selection[0].text);
      var file = new File(existingFiles.fsNames[idx]);

      try {
        var imageWindow = new Window('dialog', file.displayName);
        var img = imageWindow.add(
          'image',
          undefined,
          file
        );

        var infoField1 = imageWindow.add(
          'statictext',
          undefined,
          file.displayName,
          {
            name: 'infoField1',
          }
        );

        img.size = [512, 512];
        imageWindow.show();
      } catch (e) {
        if (e.message !== 'Invalid image data') {
          catchError(e);
        }
      }
    };

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
        infoField4.helpTip = 'Output path';

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
    button_cancel.onClick = function() {
      try {
        button_cancel_onClick();
      } catch (e) {
        catchError(e);
      };
    };
    button_cancel.margins = 0;
    button_cancel.spacing = 0;

    // searchGroup.size = [initX, 20];
    searchInfoField.size = [initX * 0.333, 20];
    searchField.size = [initX * 0.5, 20];
    searchButton.size = [initX * 0.167, 20];

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

    // w.onResizing = w.onResize = function() {
    //   // searchGroup.size = [w.size.width, 20];
    //   searchInfoField.size = [w.size.width * 0.333, 20];
    //   searchField.size = [w.size.width * 0.666, 20];
    //
    //   infoGroup1.size = [w.size.width, 20];
    //   infoGroup2.size = [w.size.width, 20];
    //   infoGroup3.size = [w.size.width, 20];
    //   infoGroup4.size = [w.size.width, 20];
    //   infoField1.size = [w.size.width, 20];
    //   infoField2.size = [w.size.width, 20];
    //   infoField3.size = [w.size.width, 20];
    //   infoField4.size = [w.size.width, 20];
    //
    //   listGroup.size = [w.size.width, 500];
    //   listItem.size = [w.size.width, 500];
    //   w.layout.resize();
    // };

    return w;
  }

  var cls = function() {
    var window;
    var cls = this;

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

    this.window = window;
  };
  cls.prototype = {
    searchField: null,

    update: function() {
      this.window.layout.layout(true);
      this.window.update();
    },
  };
  return cls;
}();
