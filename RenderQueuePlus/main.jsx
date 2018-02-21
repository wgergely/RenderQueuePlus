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
