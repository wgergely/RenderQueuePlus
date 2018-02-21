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


renderQueuePlus = function(thisObj) {
  var renderQueuePlus = this;

  var LAST_MODIFIED = '08/02/2018';
  var VERSION = '0.2.0';
  var SCRIPT_NAME = 'Render Queue+';
  var AUTHOR = 'Gergely Wootsch';
  var EMAIL = 'hello@gergely-wootsch.com';
  var WEBSITE = 'http://gergely-wootsch.com';
  var DESCRIPTION = '';
  var HELP = '';

  if (!(File.fs == 'Windows')) {
    Window.alert('Sorry, this currently only works on Windows :(\n' +
    'Let me know if you\'d like to see it implemented for macs!\n\n' +
    EMAIL, SCRIPT_NAME);
    return;
  };


  var projectFile = app.project.file;
  var scriptFile = new File($.fileName);
  var PROCESSES = {};

  // @include "common.jsx"
  // @include "icons.jsx"
  // @include "settings.jsx"
  // @include "directory.jsx"
  // @include "progressbar.jsx"
  // @include "data.jsx"
  // @include "framewindow.jsx"
  // @include "pathcontrol.jsx"
  // @include "mainwindow.jsx"
  // @include "aeparchive.jsx"
  // @include "taskmanager.jsx"
  // @include "taskmanagerUI.jsx"

  // Module globals
  var settings = new Settings();
  var listItem;
  var listGroup;
  var palette;
  var data = new Data();
  var mainWindow = new MainWindow();


  mainWindow.setlist(
    data.compnames(),
    data.filenames(),
    data.rendered().frames,
    data.missing().frames,
    data.incomplete().frames,
    data.rendered().sizes
  );
  mainWindow.show();
  return mainWindow;
}(this);
