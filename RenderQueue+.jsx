var renderQueuePlus;
var rqPlusIsValid = false;

(function() {
  var MODULE_DIR = new Folder('./RenderQueuePlus');
  var alertString = '';

  if (!(MODULE_DIR.exists)) {
    alertString += '\'' + MODULE_DIR.displayName + '\' folder is missing.\n';
    alertString += 'Make sure it is placed in the same folder ' +
    'as the \'RenderQueue+.jsx\' file.';

    Window.alert(alertString, 'RenderQueue+');

    rqPlusIsValid = false;
    return;
  }

  try {
    var f = new File(Folder.temp.fsName + '/_temp_.txt');
    f.open('w');
    f.write('test');
    f.close();
    f.remove();
  } catch (e) {
    alertString += 'The script doesn\'t have permission to run.\n\n';
    alertString += 'Make sure \'Allow Scripts to Write Files and Access Network\' is ticked in\n';
    alertString += 'Edit  >  Preferences  >  General  >  Allow Scripts to Write Files (...)';

    Window.alert(alertString, 'RenderQueue+');

    rqPlusIsValid = false;
    return;

  }
    rqPlusIsValid = true;
})();

if (rqPlusIsValid) {
  // @include "RenderQueuePlus/main.jsx"
}
