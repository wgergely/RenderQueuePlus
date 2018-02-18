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
 * Converts a range to an array of numbers
 * eg. '1-250' results in [1,2,3,..,250].
 * http://stackoverflow.com/questions/2270910/how-to-convert-sequence-of-numbers-in-an-array-to-range-of-numbers
 * @param  {string} string [description]
 * @param  {string} limit [description]
 * @return {array}       [description]
 */
function getArrayFromRange(string, limit) {
  if (string.indexOf(',') > 0) {
    var returnArr = [];
    string = string.split(',');
    for (var i = 0; i < string.length; i++) {
      if (string[i].indexOf('-') > -1) {
        // range
        returnArr = returnArr.concat(makeArray(string[i]));
      } else {
        // single number
        var match = string[i].match(/(\d*)/);
        if (match) {
          returnArr.push(parseInt(string[i]));
        }
      }
    }
    return uniq(returnArr);
  } else {
    if (string.indexOf('-') > -1) {
      // range
      return makeArray(string);
    } else {
      // single number
      return [parseInt(string)];
    }
  }

  /**
   * Private convenience function to create an array from a range string.
   * @param  {strint} string eg. 1-20
   * @return {array}        array of number
   */
  function makeArray(string) {
    var match = string.match(/(\d*)(-+)(\d*)/);
    if (!(match)) {
      return [];
    }
    var start = parseInt(match[1]);
    var end = parseInt(match[3]);
    if (start > end) {
      start = parseInt(match[3]);
      end = parseInt(match[1]);
    };

    var duration = end - start;
    if (duration > limit) {
      end = limit;
    }

    var arr = [];
    for (start; start <= end; start++) {
      arr.push(start);
    }
    return arr;
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
  list.maximumSize.height = w.maximumSize.height - 100;
  list.minimumSize.width = 550;
  w.add('button', undefined, 'Close', {
    name: 'ok',
  });
  list.size = [850, 500];
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
