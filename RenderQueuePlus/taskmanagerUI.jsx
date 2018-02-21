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


var TaskmanagerWindow = function(thisObj, inTitle, inNumColumns, columnTitles) {
    var WINDOW_WIDTH = 176;
    var WINDOW_HEIGHT = 75;

    var palette;
    var listItem;
    var button_stop;
    var button_refresh;

    var cls = function(manager) {
      var cls = this;

      this.button_stop_onClick = function() {
        manager = new Taskmanager();
        var PIDs = manager.getPIDs();
        var sel = listItem.selection;

        if (!(sel)) {
          return;
        }

        for (var i = 0; i < sel.length; i++) {
          for (var j = 0; j < PIDs.length; j++) {
            if (String(PIDs[j]) === String(sel[i])) {
              manager.kill(PIDs[j]);
            }
          }
        }
        cls.button_refresh_onClick();
        return;
      };

      this.button_refresh_onClick = function() {
        manager = new Taskmanager();
        cls.clear();
        cls.setlist(
          manager.getPIDs(),
          manager.getNames()
        );
      };

      this.button_cancel_onClick = function() {
        palette.close();
      };

      this.hide = function() {
        if (!(palette instanceof Panel)) palette.hide();
      };

      this.setlist = function(inColumn1, inColumn2) {
        if (inColumn1.length < 1) {
          var ln1 = listItem.add('item', '');
          ln1.enabled = false;
          if (inNumColumns >= 2) {
            ln1.subItems[0].text = 'No running processes.';
          };
        }

        var item = '';
        for (var i = 0; i < inColumn1.length; i++) {
          item = listItem.add('item', inColumn1[i]);
          if ( inNumColumns >= 2 ) {
            item.subItems[0].text = inColumn2[i];
          };
        }
        palette.layout.layout(true);
      };

      this.clear = function() {
        for (var i = listItem.items.length - 1; i > -1; i--) {
            listItem.remove(listItem.items[i]);
        }
      };

      this.createUI = function() {
        if (!inTitle) {
          var title = '';
        } else {
          var title = inTitle;
        }

        var isPanel = thisObj instanceof Panel;
        palette = isPanel ? thisObj : new Window(
            'palette',
            title,
            undefined,
            {
              resizeable: false,
              alignChildren: ['fill', 'fill'],
              preferredSize: [WINDOW_WIDTH, WINDOW_HEIGHT],
              margins: 0,
              spacing: 0,
            }
        );
        if (palette == null) return;

        var headerGroup = palette.add('group', undefined, {
            name: 'headerGroup',
            spacing: 0,
            margins: 0,
            alignChildren: ['fill', 'fill'],
        });

        var text = 'Active threads:';

        headerGroup.add(
            'statictext', undefined, text, {
              multiline: false,
              name: 'headerText',
            }
        );

        var listGroup = palette.add('group', undefined, {
            name: 'listGroup',
            spacing: 0,
            margins: 0,
        });

        listItem = listGroup.add(
          'listbox',
          undefined,
          '',
          {
            spacing: 0,
            margins: 0,
            name: 'listItem',
            multiselect: true,
            numberOfColumns: inNumColumns,
            showHeaders: true,
            columnTitles: columnTitles,
            preferredSize: [WINDOW_WIDTH, WINDOW_HEIGHT],
            minimumSize: [WINDOW_WIDTH, WINDOW_HEIGHT],
            maximumSize: [WINDOW_WIDTH, WINDOW_HEIGHT],
            columnWidths: [60, 100],
          }
        );

        var buttonsGroup = palette.add('group', undefined, {
            alignChildren: ['left', 'top'],
            orientation: 'row',
            spacing: 0,
            margins: 0,
        });

        button_stop = buttonsGroup.add(
          'button',
          undefined,
          'Stop',
          {
            name: 'button_stop',
          }
        );
        button_stop.onClick = function() {
          try {
            cls.button_stop_onClick();
          } catch (e) {
            catchError(e);
          }
        };
        button_stop.size = [50, 20];

        button_refresh = buttonsGroup.add(
          'button',
          undefined,
          'Refresh',
          {
            name: 'button_refresh',
          }
        );
        button_refresh.onClick = function() {
          try {
            cls.button_refresh_onClick();
          } catch (e) {
            catchError(e);
          }
        };
        button_refresh.size = [50, 20];

        var button_cancel = buttonsGroup.add(
          'button',
          undefined,
          'Close',
          {name: 'button_cancel'}
        );
        button_cancel.onClick = cls.button_cancel_onClick;
        button_cancel.size = [50, 20];
      }();

      this.show = function() {
        cls.setlist(
          manager.getPIDs(),
          manager.getNames()
        );

        palette.findElement('headerText').size = [listItem.size[0], 10];

        if (listItem.size[1] > WINDOW_HEIGHT) {
           listItem.size = [listItem.size[0], WINDOW_HEIGHT];
        } else {
          listItem.size = [listItem.size[0], WINDOW_HEIGHT];
        }
        palette.layout.layout(true);
        palette.layout.resize();

        if (!(palette instanceof Panel)) {
          palette.show();
        };
      };
    };
    return cls;
}(
  this,
  'Background Render Processes',
  2,
  ['PID', 'Name']
);
