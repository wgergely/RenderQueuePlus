(function(thisObj) {
  var LAST_MODIFIED = '29/01/2018';
  var VERSION = '0.1.15';
  var SCRIPT_NAME = 'Render Queue+';
  var AUTHOR = 'Gergely Wootsch';
  var EMAIL = 'hello@gergely-wootsch.com';
  var WEBSITE = 'http://gergely-wootsch.com';
  var DESCRIPTION = '';
  var HELP = '';

  var projectFile = app.project.file;
  var scriptFile = new File($.fileName);

  //@include "common.jsx"
  //@include "settings.jsx"
  //@include "directory.jsx"
  //@include "data.jsx"
  //@include "framewindow.jsx"
  //@include "pathcontrol.jsx"
  //@include "mainwindow.jsx"

  var settings = new Settings();
  settings.setbasepath();

  var data = new Data();
  data.setData();

  var listItem;
  var listGroup;
  var palette;

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

  this.window = mainWindow;
  return this;
})(this);
