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
 * Data class
 * @return {[type]} [description]
 */
var Data = function() {
  var DATA = {};

  /**
   * Private convenience function that populates a dataObj.
   * @param {object} dataObj The dataObject to populate
   * @param {outputModule} rqItem  outputModule
   * @param {renderQueueItem} omItem  renderQueueItem
   * @return {object} populated dataObj
   */
  function setData(dataObj, rqItem, omItem) {
    if (!(dataObj.ready && omItem.file)) {
      dataObj.sequencename = 'File not yet specified.';
      dataObj.displayName = 'File not yet specified.';
      dataObj.ext = null;
      dataObj.padding = null;

      dataObj.exists = {
        frames: '-',
        names: ['No files rendered.'],
        paths: [],
        size: formatBytes(0, 2),
        sizes: [],
        dates: [],
        count: 0,
      };

      dataObj.rendered = {
        frames: '-',
        names: ['No files rendered.'],
        paths: [],
        size: formatBytes(0, 2),
        sizes: [],
        dates: [],
        count: 0,
      };

      dataObj.missing = {
        frames: '-',
        names: ['No files rendered.'],
        paths: [],
        size: formatBytes(0, 2),
        sizes: [],
        dates: [],
        count: 0,
      };

      dataObj.incomplete = {
        frames: '-',
        names: ['No files rendered.'],
        paths: [],
        size: formatBytes(0, 2),
        sizes: [],
        dates: [],
        count: 0,
      };
      return dataObj;
    }

    var oneframe = rqItem.comp.frameDuration;

    dataObj.startframe = Math.round(
      (rqItem.timeSpanStart / oneframe) +
      (rqItem.comp.displayStartTime / oneframe)
    );
    dataObj.endframe = Math.round(
      (rqItem.timeSpanStart / oneframe) +
      (rqItem.timeSpanDuration / oneframe) +
      (rqItem.comp.displayStartTime / oneframe)
    );
    dataObj.duration = Math.round(
      dataObj.endframe - dataObj.startframe
    );
    dataObj.framerate = (1 / rqItem.comp.frameDuration);
    dataObj.width = rqItem.comp.width;
    dataObj.height = rqItem.comp.height;

    dataObj.padding = getPadding(omItem.file.name);

    if (dataObj.isSequence && (dataObj.padding === null)) {
      Window.alert(
        dataObj.displayName + ' is a sequence but the output name has no padding.\n' +
        'Check your output path.',
        SCRIPT_NAME
      );
    }

    if ((dataObj.isSequence === false) && (dataObj.padding > 0)) {
      Window.alert(
        dataObj.displayName + ' is not a sequence but the output name has padding.\n' +
        'Check your output path.',
        SCRIPT_NAME
      );
    }

    dataObj.basepath = omItem.file.parent.absoluteURI;


    var re = /(\.)([a-zA-Z]{1,})$/i;
    if (re.test(omItem.file.name)) {
      dataObj.ext = omItem.file.name.match(re)[2];
    } else {
      dataObj.ext = '';
    }

    if (!dataObj.padding) {
      dataObj.basename = omItem.file.displayName.slice(
        0, (dataObj.ext.length + 1 * (-1))
      );
      dataObj.sequencename = (
        decodeURI(decodeURI(omItem.file.name)) + ' ' + '[' +
        pad(dataObj.startframe, dataObj.padding) + '-' +
        pad(dataObj.endframe, dataObj.padding) + ']'
      );
    } else {
      dataObj.basename = omItem.file.displayName.slice(
        0, ((dataObj.padding + 2 + dataObj.ext.length + 1) * (-1))
      );

      dataObj.sequencename = (
        dataObj.basename +
        '[' + pad(dataObj.startframe, dataObj.padding) +
        '-' +
        pad(dataObj.endframe, dataObj.padding) + ']' + '.' +
        dataObj.ext
      );
    };

    dataObj.displayName = (
      omItem.file.parent.displayName +
      '/' +
      dataObj.sequencename
    );

    var dir = new Directory(omItem.file.parent);
    var files;

    if (dataObj.padding > 0) {
      files = dir.getFiles('*.' + dataObj.ext);
    } else {
      files = dir.getFiles(omItem.file.displayName);
    }

    // Error
    // if (
    //   files.hasOwnProperty('Invalid path.') ||
    //   files.hasOwnProperty('Error.')
    // ) {
    //   dataObj.exists = {
    //     frames: '-',
    //     names: [],
    //     paths: [],
    //     size: formatBytes(0, 2),
    //     sizes: [formatBytes(0, 2)],
    //     dates: [],
    //     count: 0,
    //   };
    //
    //   dataObj.rendered = {
    //     frames: '-',
    //     names: [],
    //     paths: [],
    //     size: formatBytes(0, 2),
    //     sizes: [formatBytes(0, 2)],
    //     dates: [],
    //     count: 0,
    //   };
    //
    //   dataObj.missing = {
    //     frames: '-',
    //     names: [],
    //     paths: [],
    //     size: formatBytes(0, 2),
    //     sizes: [formatBytes(0, 2)],
    //     dates: [],
    //     count: 0,
    //   };
    //
    //   dataObj.incomplete = {
    //     frames: '-',
    //     names: [],
    //     paths: [],
    //     size: formatBytes(0, 2),
    //     sizes: [formatBytes(0, 2)],
    //     dates: [],
    //     count: 0,
    //   };
    //
    //   return dataObj;
    // } // error

    var frame;
    var name = '';
    var fname = '';
    var fsName;

    var notmissingNames = [];
    var notmissingFrames = [];
    var notmissingpaths = [];
    var notmissingSizes = [];
    var notmissingDates = [];

    var existsNames = [];
    var existsFrames = [];
    var existspaths = [];
    var existsSizes = [];
    var existsDates = [];

    var missingNames = [];
    var missingFrames = [];
    var missingpaths = [];

    var partialNames = [];
    var partialFrames = [];
    var partialpaths = [];
    var partialSizes = [];
    var partialDates = [];

    var size = 0;
    var formattedSize = 0;

    // Image sequence
    if (dataObj.padding > 0) {
      name = (
        decodeURI(omItem.file.name).slice(
          0,
          (
            dataObj.padding +
            '[]'.length +
            dataObj.ext.length + 1
          ) * (-1)
        )
      );
      var progressbar = new PBar(dataObj.duration + dataObj.startframe);
      var n = 100;
      progressbar.show();

      for (
        var i = dataObj.startframe; i <= dataObj.duration + dataObj.startframe; i++
      ) {
        // Progress bar
        if (i % n === (n - 1)) {
          progressbar.hit(i);
          progressbar.update();
        }

        frame = pad(i, dataObj.padding);
        fname = name + frame + '.' + dataObj.ext;
        fsName = omItem.file.parent.absoluteURI + '/' + fname;

        if (files.hasOwnProperty(fname)) {
          notmissingNames.push(fname);
          notmissingFrames.push(i);
          notmissingpaths.push(fsName);
          notmissingSizes.push(formatBytes(files[fname].size, 2));
          notmissingDates.push(files[fname].date + ' ' + files[fname].time);

          if (files[fname].size > 50) {
            existsNames.push(fname);
            existsFrames.push(i);
            existspaths.push(fsName);
            existsSizes.push(formatBytes(files[fname].size, 2));
            existsDates.push(files[fname].date + ' ' + files[fname].time);
            size += files[fname].size;
          } else {
            partialNames.push(fname);
            partialFrames.push(i);
            partialpaths.push(fsName);
            partialSizes.push(formatBytes(files[fname].size, 2));
            partialDates.push(files[fname].date + ' ' + files[fname].time);
          }
        } else {
          missingNames.push(fname);
          missingFrames.push(i);
          missingpaths.push(fsName);
        }
      }; // end of loop

      progressbar.palette().size = [1, 1];
      progressbar.close();
      formattedSize = formatBytes(size, 2);

      dataObj.exists = {
        frames: getRanges(notmissingFrames),
        names: notmissingNames,
        paths: notmissingpaths,
        size: formattedSize,
        sizes: notmissingSizes,
        dates: notmissingDates,
        count: notmissingFrames.length,
      };

      dataObj.rendered = {
        frames: getRanges(existsFrames),
        names: existsNames,
        paths: existspaths,
        size: formattedSize,
        sizes: existsSizes,
        dates: existsDates,
        count: existsNames.length,
      };

      dataObj.missing = {
        frames: getRanges(missingFrames),
        names: missingNames,
        paths: missingpaths,
        size: formatBytes(0, 2),
        sizes: [],
        dates: [],
        count: missingNames.length,
      };
      dataObj.incomplete = {
        frames: getRanges(partialFrames),
        names: partialNames,
        fsName: partialpaths,
        size: formatBytes(0, 2),
        sizes: partialSizes,
        dates: partialDates,
        count: partialNames.length,
      };
      // Movies
    } else {
      name = (
        decodeURI(omItem.file.name).slice(
          0,
          dataObj.ext.length * (-1)
        )
      );

      frame = 1;
      fname = decodeURI(omItem.file.name);
      fsName = omItem.file.parent.absoluteURI + '/' + fname;
      if (files.hasOwnProperty(fname)) {
        notmissingNames.push(fname);
        notmissingFrames.push(frame);
        notmissingpaths.push(fsName);
        notmissingSizes.push(formatBytes(files[fname].size, 2));
        notmissingDates.push(files[fname].date + ' ' + files[fname].time);
        if (files[fname].size > 50) {
          existsNames.push(fname);
          existsFrames.push(frame);
          existspaths.push(fsName);
          existsSizes.push(formatBytes(files[fname].size, 2));
          existsDates.push(files[fname].date + ' ' + files[fname].time);
          size += files[fname].size;
        } else {
          partialNames.push(fname);
          partialFrames.push(frame);
          partialpaths.push(fsName);
          partialSizes.push(formatBytes(files[fname].size, 2));
          partialDates.push(files[fname].date + ' ' + files[fname].time);
        }
      } else {
        missingNames.push(fname);
        missingFrames.push(frame);
        missingpaths.push(fsName);
      }

      formattedSize = formatBytes(size, 2);
      dataObj.exists = {
        frames: 1,
        names: notmissingNames,
        paths: notmissingpaths,
        size: formattedSize,
        sizes: notmissingSizes,
        dates: notmissingDates,
        count: notmissingFrames.length,
      };

      dataObj.rendered = {
        frames: getRanges(existsFrames),
        names: existsNames,
        paths: existspaths,
        size: formattedSize,
        sizes: existsSizes,
        dates: existsDates,
        count: existsNames.length,
      };

      dataObj.missing = {
        frames: getRanges(missingFrames),
        names: missingNames,
        paths: missingpaths,
        size: formatBytes(0, 2),
        sizes: [],
        dates: [],
        count: missingNames.length,
      };

      dataObj.incomplete = {
        frames: getRanges(partialFrames),
        names: partialNames,
        fsName: partialpaths,
        size: formatBytes(0, 2),
        sizes: partialSizes,
        dates: partialDates,
        count: partialNames.length,
      };
    }
    return dataObj;
  }

  var cls = function() {
    this.getOutputModule = function(rqIndex, omIndex) {
      var rqItem;
      var omItem;

      try {
        rqItem = app.project.renderQueue.items[rqIndex];
        omItem = rqItem.outputModule(omIndex);
        return omItem;
      } catch (e) {
        return null;
      }
    };

    this.getComp = function(rqIndex) {
      var rqItem;
      try {
        rqItem = app.project.renderQueue.items[rqIndex];
        return rqItem.comp;
      } catch (e) {
        return null;
      }
    };

    this.setData = function(idx) {
      /**
       * Private convenience function
       * @param {number} i rqIndex
       * @param {number} j omIndex
       * @return {object} dataObj
       */
      function setDataObj(i, j) {
        var ffmpeg;
        var rqItem = app.project.renderQueue.item(i);
        var omItem = rqItem.outputModule(j);

        dataObj = {};
        dataObj.projectName = app.project.name;

        if (!(omItem.file)) {
          var fsName = getSetting('pathcontrol_path');
          omItem.file = new File(fsName + '/tempOutput');
        }

        dataObj.ready = function() {
          if (rqItem.status == RQItemStatus.QUEUED) {
            return true;
          } else if (rqItem.status == RQItemStatus.NEEDS_OUTPUT) {
            return true;
          } else if (rqItem.status == RQItemStatus.UNQUEUED) {
            return false;
          } else if (rqItem.status == RQItemStatus.DONE) {
            return false;
          };
        }();

        dataObj.rqIndex = i;
        dataObj.omIndex = j;
        dataObj.comp = rqItem.comp;
        dataObj.compname = fileNameSafeString(dataObj.comp.name);

        dataObj.file = function() {
          if (dataObj.ready) {
            if (omItem.file) {
              return omItem.file;
            } else {
              return null;
            };
          } else {
            return null;
          };
        }();

        dataObj.isSequence = function() {
          if (dataObj.file) {
            ffmpeg = new FFMPEG();
            return ffmpeg.isSequence(omItem.file.absoluteURI);
          } else {
            return null;
          }
        }();

        dataObj.displayName = null;
        dataObj.basepath = null;
        dataObj.basename = null;

        dataObj.sequencename = null;
        dataObj.ext = null;
        dataObj.padding = null;
        dataObj.startframe = null;
        dataObj.endframe = null;
        dataObj.duration = null;
        dataObj.framerate = null;
        dataObj.width = null;
        dataObj.height = null;

        dataObj.exists = {
          frames: null,
          names: null,
          paths: null,
          size: null,
          sizes: null,
          dates: null,
          count: null,
        };

        dataObj.rendered = {
          frames: null,
          names: null,
          paths: null,
          size: null,
          sizes: null,
          dates: null,
          count: null,
        };

        dataObj.missing = {
          frames: null,
          names: null,
          paths: null,
          size: null,
          sizes: null,
          dates: null,
          count: null,
        };

        dataObj.incomplete = {
          frames: null,
          names: null,
          fsName: null,
          size: null,
          sizes: null,
          dates: null,
          count: null,
        };

        return setData(dataObj, rqItem, omItem);
      }

      var dataObj = {};
      var i = 1;
      var j = 1;

      if (typeof idx !== 'undefined') {
        if (!(idx === null)) {
          i = DATA[idx].rqIndex;
          j = DATA[idx].omIndex;
          DATA[idx] = setDataObj(i, j);
          return;
        }
      }

      DATA = {};
      var k = 0;
      for (i = 1; i <= app.project.renderQueue.numItems; i++) {
        for (j = 1; j <= app.project.renderQueue.item(i).numOutputModules; j++) {
          DATA[k] = setDataObj(i, j);
          ++k;
        }
      }
    };

    this.count = function() {
      var keys = [];
      for (var key in DATA) {
        keys.push(key);
      };
      return keys.length;
    };

    this.item = function(index) {
      return DATA[index];
    };

    this.compnames = function() {
      var arr = [];
      var keys = [];

      for (var key in DATA) {
        keys.push(key);
      };

      if (isObjectEmpty(DATA)) {
        return ['No active output modules found.'];
      } else {
        for (var i = 0; i < keys.length; i++) {
          arr.push(DATA[i].compname);
        }
        return arr;
      }
    };

    this.displayNames = function() {
      var arr = [];
      var keys = [];

      for (var key in DATA) {
        keys.push(key);
      };

      if (isObjectEmpty(DATA)) {
        return ['No active output modules found.'];
      } else {
        for (var i = 0; i < keys.length; i++) {
          if (DATA[i].file) {
            arr.push(DATA[i].displayName);
          } else {
            arr.push('Not queued');
          }
        }
        return arr;
      }
    };

    this.rendered = function() {
      var keys = [];
      for (var key in DATA) {
        keys.push(key);
      };

      var returnObj = {
        frames: [],
        names: [],
        paths: [],
        sizes: [],
        counts: [],
      };

      if (isObjectEmpty(DATA)) {
        return returnObj;
      } else {
        for (var i = 0; i < keys.length; i++) {
          returnObj.frames.push(DATA[i].rendered.frames);
          returnObj.names.push(DATA[i].rendered.names);
          returnObj.paths.push(DATA[i].rendered.paths);
          returnObj.sizes.push(DATA[i].rendered.size);
          returnObj.counts.push(DATA[i].rendered.count);
        }
        return returnObj;
      }
    };

    this.missing = function() {
      var keys = [];
      for (var key in DATA) {
        keys.push(key);
      };

      var returnObj = {
        frames: [],
        names: [],
        paths: [],
        counts: [],
      };

      if (isObjectEmpty(DATA)) {
        return returnObj;
      } else {
        for (var i = 0; i < keys.length; i++) {
          returnObj.frames.push(DATA[i].missing.frames);
          returnObj.names.push(DATA[i].missing.names);
          returnObj.paths.push(DATA[i].missing.paths);
          returnObj.counts.push(DATA[i].missing.count);
        }
        return returnObj;
      }
    };

    this.incomplete = function() {
      var keys = [];
      for (var key in DATA) {
        keys.push(key);
      };

      var returnObj = {
        frames: [],
        names: [],
        paths: [],
        counts: [],
      };

      if (isObjectEmpty(DATA)) {
        return returnObj;
      } else {
        for (var i = 0; i < keys.length; i++) {
          returnObj.frames.push(DATA[i].incomplete.frames);
          returnObj.names.push(DATA[i].incomplete.names);
          returnObj.paths.push(DATA[i].incomplete.paths);
          returnObj.counts.push(DATA[i].incomplete.count);
        }
        return returnObj;
      }
    };

    this.exists = function() {
      var keys = [];
      for (var key in DATA) {
        keys.push(key);
      };

      var returnObj = {
        frames: [],
        names: [],
        paths: [],
        counts: [],
      };

      if (isObjectEmpty(DATA)) {
        return returnObj;
      } else {
        for (var i = 0; i < keys.length; i++) {
          returnObj.frames.push(DATA[i].exists.frames);
          returnObj.names.push(DATA[i].exists.names);
          returnObj.paths.push(DATA[i].exists.paths);
          returnObj.counts.push(DATA[i].exists.count);
        }
        return returnObj;
      }
    };
    this.setData();
  };
  return cls;
}();
