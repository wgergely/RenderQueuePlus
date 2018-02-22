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


/**
 * Platform specific separator character
 * @return {[type]} [description]
 */
var sep = (function() {
  if (File.fs === 'Windows') {
    return '\\';
  }
}());

/**
 * After Effects helper script: returns the number of leading zeros
 * @param  {string} n string to extrapolate the padding from
 * @return {integer}   the number of leading zeros
 */
function getPadding(n) {
  var e = decodeURI(n).match(
    /\[#\]|\[##\]|\[###\]|\[####\]|\[#####\]|\[######\]/g
  );
  return e ? e[0].length - 2 : null;
}

/**
 * Returns the number of digits of a number found
 * in the given string.
 * @param  {String} inString String to examine
 * @return {Number}          the number of digits
 */
function getPaddingFromName(inString) {
  var re1 = /\d{5}\.[a-zA-Z]+$/ig;
  var re2 = /\d{4}\.[a-zA-Z]+$/ig;
  var re3 = /\d{3}\.[a-zA-Z]+$/ig;
  var re4 = /\d{2}\.[a-zA-Z]+$/ig;
  if (re1.test(inString)) {
    return 5;
  } else if (re2.test(inString)) {
    return 4;
  } else if (re3.test(inString)) {
    return 3;
  } else if (re4.test(inString)) {
    return 2;
  } else {
    return null;
  }
}

/**
 * Returns the frame number
 * @param  {String} inString a path to a file.
 * @return {String}         the frame number as a string with padding included.
 */
function getFrameNumberFromName(inString) {
  var re1 = /\d{5}\.[a-zA-Z]+$/ig;
  var re2 = /\d{4}\.[a-zA-Z]+$/ig;
  var re3 = /\d{3}\.[a-zA-Z]+$/ig;
  var re4 = /\d{2}\.[a-zA-Z]+$/ig;

  var re;

  if (re1.test(inString)) {
    re = re1;
  } else if (re2.test(inString)) {
    re = re2;
  } else if (re3.test(inString)) {
    re = re3;
  } else if (re4.test(inString)) {
    re = re4;
  } else {
    return null;
  }

  return inString.match(re)[0].split('.')[0];
}

/**
 * Return the version number from the given string
 * eg 'v001'
 * @param  {string} inString string containing the version
 * @return {number}          the version number
 */
function getVersionNumberFromString(inString) {
  var match = inString.match(/(v\d\d\d)/ig);
  if (match) {
    return parseInt(match[0].slice(1), 10);
  }
  return null;
}

/**
 * Adds n number of leading zeros to a given number
 * @param  {integer} a the number to pad
 * @param  {integer} b number of leading zeros
 * @return {string}   the padded number
 */
function pad(a, b) {
  for (var c = a + ''; c.length < b;) c = '0' + c;
  return c;
}


/**
 * Returns array of unique values.
 * @param  {[type]} a [description]
 * @return {[type]}   [description]
 */
function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

/**
 * Converts a range to a dictionary of numbers
 * eg. '1-250' results in [1,2,3,..,250].
 * http://stackoverflow.com/questions/2270910/how-to-convert-sequence-of-numbers-in-an-array-to-range-of-numbers
 * @param  {string} string [description]
 * @param  {string} limit [description]
 * @return {array}       [description]
 */
function getArrayFromRange(string, limit) {
  var d = {};

  var match;
  var start;
  var end;
  var duration;
  var idx;

  if (string.indexOf(',') > 0) {
    string = string.split(',');
    for (var i = 0; i < string.length; i++) {
      if (string[i].indexOf('-') > -1) {
        match = string[i].match(/(\d*)(-+)(\d*)/);

        if (!(match)) {
          continue;
        }

        start = parseInt(match[1], 10);
        end = parseInt(match[3], 10);

        if (start > end) {
          start = parseInt(match[3], 10);
          end = parseInt(match[1], 10);
        };

        duration = end - start;
        if (duration > limit) {
          end = limit;
        }

        idx = start;
        for (idx; idx <= end; idx++) {
          d[idx] = idx;
        }
      } else {
        match = string[i].match(/(\d*)/);
        if (!(match)) {
          continue;
        }

        d[parseInt(string[i], 10)] = parseInt(string[i], 10);
      }
    }
    return d;
  } else {
    if (string.indexOf('-') > -1) {
      // range
      match = string.match(/(\d*)(-+)(\d*)/);

      if (!(match)) {
        return {};
      }

      start = parseInt(match[1], 10);
      end = parseInt(match[3], 10);

      if (start > end) {
        start = parseInt(match[3], 10);
        end = parseInt(match[1], 10);
      };

      duration = end - start;
      if (duration > limit) {
        end = limit;
      }

      idx = start;
      for (idx; idx <= end; idx++) {
        d[idx] = idx;
      }
      return d;
    } else {
      // single number
      d = {};
      d[parseInt(string, 10)] = parseInt(string, 10);
      return d;
    }
  }
}


/**
 * Returns a string representation of an array.
 * eg. [1,2,3,..,250] results in '1-250'.
 * http://stackoverflow.com/questions/2270910/how-to-convert-sequence-of-numbers-in-an-array-to-range-of-numbers
 * @param  {[type]} array [description]
 * @return {[type]}       [description]
 */
function getRanges(array) {
  var ranges = [];
  var rstart;
  var rend;
  for (var i = 0; i < array.length; i++) {
    rstart = array[i];
    rend = rstart;
    while (array[i + 1] - array[i] == 1) {
      rend = array[i + 1]; // increment the index if the numbers sequential
      i++;
    }
    ranges.push(rstart == rend ? rstart + '' : rstart + '-' + rend);
  }
  return ranges.join(', ');
};

/**
 * CLips the given string to the specified length:
 * '...clipped text'
 * @param  {string}  inString the text to clip
 * @param  {number}  length   clip the string to this length
 * @return {string}          the clipped text
 */
function ellipsis(inString, length) {
  if (!(length)) {
    var length = 100;
  }

  if (inString) {
    if (inString.length > length) {
      var head = inString.substr(0, 0);
      var dots = '...';
      var tail = inString.substr(inString.length - length, inString.length);
      return head + dots + tail;
    }
    return inString;
  } else {
    return '-';
  }
};

/**
 * Clips the given string to the specified length.
 * 'The clipped (...) text'
 * @param  {string}  inString the text to clip
 * @param  {number}  length   clip the string to this length
 * @return {string}          the clipped text
 */
 function ellipsis2(inString, length) {
   if (!(length)) {
     var length = 75;
   }
   if (inString) {
     if (inString.length > length) {
       var head = inString.substr(0, Math.round(length/2));
       var dots = ' ... ';
       var tail = inString.substr(inString.length - Math.round(length/2), inString.length);
       return head + dots + tail;
     }
     return inString;
   } else {
     return '-';
   }
 };

/**
 * Formats a byte into a human readable string, eg 1024 -> '1KB'
 * http://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
 * @param  {number} a bytes
 * @param  {number} b decimals
 * @return {string}   formatted text
 */
function formatBytes(a, b) {
  if (0 === a) return '0 Byte';
  var c = 1024;
  var d = b + 1 || 3;
  var e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var f = Math.floor(Math.log(a) / Math.log(c));
  return (a / Math.pow(c, f)).toPrecision(d) + ' ' + e[f];
};


/**
 * String.trim() Polyfill
 * @param  {string} String [description]
 * @return {string}        [description]
 */
Array.prototype.trim || (String.prototype.trim = function() {
  return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
});

/**
 * Array.indexOf() Polyfill
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
Array.prototype.indexOf || (Array.prototype.indexOf = function(a, b) {
  var c;
  if (null === this) throw new TypeError('"this" is null or not defined');
  var d = Object(this);
  var e = d.length >>> 0;
  if (0 === e) return -1;
  var f = +b || 0;
  if (Math.abs(f) === 1 / 0 && (f = 0), f >= e) return -1;
  for (c = Math.max(f >= 0 ? f : e - Math.abs(f), 0); e > c;) {
    if (c in d && d[c] === a) return c;
    c++;
  }
  return -1;
});

/**
 * Imports a given footage path to the project.
 * Creates a 'prerenders' folder with 'comp' and 'verion' subfolders
 * where the new footage item is placed.
 * @param  {[type]} inPath   [description]
 * @param  {[type]} sequence [description]
 * @param  {[type]} compName [description]
 * @param  {[type]} version  [description]
 * @return {[type]}          [description]
 */
function importFootage(inPath, sequence, compName, version) {
  /**
   * private convenence function to import a footage item
   * @param  {[type]} inPath [description]
   * @return {[type]}        [description]
   */
  function importFile(inPath) {
    var IO = new ImportOptions();
    IO.file = new File(inPath);
    IO.sequence = sequence;
    if (IO.canImportAs(ImportAsType.FOOTAGE)) {
      IO.importAs = ImportAsType.FOOTAGE;
    }
    return app.project.importFile(IO);
  };

  var footageItem = importFile(inPath);
  var folderItem;

  var rExists = false;
  var cExists = false;
  var vExists = false;
  var r;
  var c;
  var v;

  var i = 1;

  app.beginUndoGroup('Import footage');

  for (i = 1; i <= app.project.rootFolder.items.length; i++) {
    folderItem = app.project.rootFolder.item(i);
    if (
      (folderItem instanceof FolderItem) &&
      (folderItem.name === 'prerenders')
    ) {
      rExists = true;
      r = folderItem;
      break;
    }
  }

  if (!rExists) {
    r = app.project.items.addFolder('prerenders');
    r.parentFolder = app.project.rootFolder;
  }

  for (i = 1; i <= r.items.length; i++) {
    if (fileNameSafeString(r.item(i).name) === fileNameSafeString(compName)) {
      cExists = true;
      c = r.item(i);
      break;
    }
  }

  if (!cExists) {
    c = app.project.items.addFolder(compName);
    c.parentFolder = r;
  }

  for (i = 1; i <= c.items.length; i++) {
    if (c.item(i).name === version) {
      vExists = true;
      v = c.item(i);
      break;
    }
  }

  if (!vExists) {
    v = app.project.items.addFolder(version);
    v.parentFolder = c;
  }

  for (i = 1; i <= v.items.length; i++) {
    if (v.item(i).name === footageItem.name) {
      Window.alert(
        'Footage already exists in the project.',
        SCRIPT_NAME
      );
      footageItem.remove();
      footageItem = v.item(i);
    }
  }
  footageItem.parentFolder = v;
  app.endUndoGroup();

  return footageItem;
}


/**
 * [Displays a popup dialog with editable text contents
 * @param  {string} title Title of the dialog
 * @param  {string} input Dialog contents
 */
function alertScroll(title, input) {
  var w = new Window('dialog', title);
  var list = w.add('edittext', undefined, input, {
    multiline: true,
    scrolling: true,
  });
  w.add('button', undefined, 'Close', {
    name: 'ok',
  });
  list.size = [600, 300];
  w.show();
}

/**
 * Custom error catcher.
 * @param  {[type]} e [description]
 */
function catchError(e) {
  var prop;

  var number;
  var filename;
  var line;
  var source;
  var start;
  var end;
  var message;
  var name;
  var description;

  var MESSAGE = '';

  for (prop in e) {
    if (prop == 'number') {
      number = parseInt(e[prop]);
    } else if (prop == 'fileName') {
      filename = new File(e[prop]).fsName;
    } else if (prop == 'line') {
      line = parseInt(e[prop]);
    } else if (prop == 'source') {
      source = e[prop];
      source = source.trim();
      source = source.split('\n');
      var ln = '';
      for (var i = 0; i < source.length; i++) {
        ln += String(pad(i + 1, 4)) + '  ' + String(source[i]) + '\n';
      }
      source = ln;
    } else if (prop == 'start') {
      start = e[prop];
    } else if (prop == 'end') {
      end = e[prop];
    } else if (prop == 'message') {
      message = e[prop];
    } else if (prop == 'name') {
      name = e[prop];
    } else if (prop == 'description') {
      description = e[prop];
    }
  };
  MESSAGE = String(
    'Error:\n\n' +
    '---------------------------------\n\n' +
    '"' + message + '"\n\n' +
    '---------------------------------\n\n' +
    'Line number: ' + line + '\n' +
    'File: ' + filename + '\n\n' +
    'Source:\n\n' + source
  );
  alertScroll(SCRIPT_NAME, MESSAGE);
};

/**
 * Returns a filename safe string
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function fileNameSafeString(str) {
  return str
    .replace(/([^a-z0-9]+)/gi, '_')
    .replace(/-{2,}/g, '_')
    .toLowerCase();
}


/**
 * Reveals the folder if exists, or it's parent.
 * @param  {ExtendScriptFileObject} p the file or folder object to reveal
 */
function reveal(p) {
  if (p.exists) {
    p.execute();
  } else {
    reveal(p.parent);
  }
};

/**
 * Opens the given website in a browser.
 * @param  {string} url the url to visit
 */
function openLink(url) {
   var linkJumper = new File(Folder.temp.absoluteURI + '/rqplus_link.html');
   linkJumper.open('w');
   var linkBody = '<html><head><META HTTP-EQUIV=Refresh CONTENT="0; URL=' + url + '"></head><body><p></body></html>';
   linkJumper.write(linkBody);
   linkJumper.close();
   linkJumper.execute();
}

/**
 * Sets the default renderQueue item properties.
 * As of CC 2018 the output module properties are
 * still read-only. Come on Adobe...
 * @param {integer} rqIndex Render Queue item index (1-based).
 * @param {integer} omIndex Render Queue OutputModule index (1-based).
 * @param {object} pathcontrol Pathcontrol instance.
 */
function setRenderQueueItemDefaults(rqIndex, omIndex, pathcontrol) {
  var rqItem = app.project.renderQueue.item(rqIndex);
  var omItem = data.getOutputModule(rqIndex, omIndex);

  rqItem.setSetting('Time Span', 0); // 'Length of the comp'
  if (pathcontrol.getPadding() === 0) {
    rqItem.setSetting('Skip Existing Files', false);
  } else {
    rqItem.setSetting('Skip Existing Files', true);
  }

  /**
   * Overrides output module settings.
   * TODO: This perhaps needs exposing.
   * Keeping it unexposed for the time being.
   */
   function setDefaults() {
    rqItem.setSetting('Quality', 2); // 'best'
    rqItem.setSetting('Resolution', '1,1'); // 'full' {'x': 1, 'y': 1}
    omItem.setSetting('Video Output', true);
    omItem.setSetting('Use Comp Frame Number', false);
    omItem.setSetting('Starting #', 1);
    omItem.setSetting('Resize', false);
  }

  // TODO: get Adobe to make these variables scriptable.
  // omItem.setSetting('Format', 7); // 'PNG' - READ ONLY PROPERTY
  // omItem.setSetting('Channels', 1); // 'RGBA' - READ ONLY PROPERTY
  // omItem.setSetting('Depth', 32); // 'Millions+' - READ ONLY PROPERTY
  // omItem.setSetting('Color', 0); // 'Straight' - READ ONLY PROPERTY
};

/**
 * Checks if an object is empty
 * @param  {object}  o the object to check
 * @return {Boolean}
 */
function isObjectEmpty(o) {
  var key;
  for (key in o) {
    return false;
  }
  return true;
}

/**
 * Returns a count of output modules
 * @return {number} number of output modules
 */
function numOutputModules() {
  var i = 1;
  var j = 1;
  var k = 0;
  for (i = 1; i <= app.project.renderQueue.numItems; i++) {
    for (j = 1; j <= app.project.renderQueue.item(i).numOutputModules; j++) {
      ++k;
    }
  }
  return k;
};

/**
 * Runs checks before executing aerender
 * @param {Number} rqIndex Index
 * @return {Bool} [description]
 */
function aerenderOkToStart(rqIndex) {
  var err = 'After Effects warning: \'Skip Existing Files\' is available only with ONE output module of type \'Sequence\'.';
  if (app.project.renderQueue.item(rqIndex).numOutputModules > 1) {
    if (app.project.renderQueue.item(rqIndex).getSetting('Skip Existing Files')) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
  return true;
}
