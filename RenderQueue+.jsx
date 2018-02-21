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
