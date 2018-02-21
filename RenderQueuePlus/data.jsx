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
      dataObj.filename = 'File not yet specified.';
      dataObj.ext = null;
      dataObj.padding = null;

      dataObj.exists = {
        frames: '-',
        names: ['No files rendered.'],
        fsNames: [],
        size: formatBytes(0, 2),
        sizes: [],
        dates: [],
        count: 0,
      };

      dataObj.rendered = {
        frames: '-',
        names: ['No files rendered.'],
        fsNames: [],
        size: formatBytes(0, 2),
        sizes: [],
        dates: [],
        count: 0,
      };

      dataObj.missing = {
        frames: '-',
        names: ['No files rendered.'],
        fsNames: [],
        size: formatBytes(0, 2),
        sizes: [],
        dates: [],
        count: 0,
      };

      dataObj.incomplete = {
        frames: '-',
        names: ['No files rendered.'],
        fsNames: [],
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
      (rqItem.timeSpanDuration / oneframe)
    );
    dataObj.duration = Math.round(
      dataObj.endframe - dataObj.startframe
    );

    dataObj.padding = getPadding(omItem.file.name);
    dataObj.ext = omItem.file.name.slice(-3);
    if (!dataObj.padding) {
      dataObj.sequencename = (
        decodeURI(decodeURI(omItem.file.name)) + ' ' + '[' +
        pad(dataObj.startframe, dataObj.padding) + '-' +
        pad(dataObj.endframe, dataObj.padding) + ']'
      );
    } else {
      dataObj.sequencename = (
        decodeURI(decodeURI(omItem.file.name).slice(
          0, ((dataObj.padding + 2 + 4) * (-1)))) +
        '[' + pad(dataObj.startframe, dataObj.padding) + '-' +
        pad(dataObj.endframe, dataObj.padding) + ']' + '.' + dataObj.ext
      );
    };

    dataObj.filename = (
      decodeURI(omItem.file.parent.name) +
      sep +
      decodeURI(dataObj.sequencename)
    );

    var dir = new Directory(omItem.file.parent);
    var files;

    if (dataObj.padding > 0) {
      files = dir.getFiles('*.' + dataObj.ext);
    } else {
      files = dir.getFiles(omItem.file.displayName);
    }

    // Error
    if (
      files.hasOwnProperty('Invalid path.') ||
      files.hasOwnProperty('Error.')
    ) {
      dataObj.exists = {
        frames: '-',
        names: [],
        fsNames: [],
        size: formatBytes(0, 2),
        sizes: [formatBytes(0, 2)],
        dates: [],
        count: 0,
      };

      dataObj.rendered = {
        frames: '-',
        names: [],
        fsNames: [],
        size: formatBytes(0, 2),
        sizes: [formatBytes(0, 2)],
        dates: [],
        count: 0,
      };

      dataObj.missing = {
        frames: '-',
        names: [],
        fsNames: [],
        size: formatBytes(0, 2),
        sizes: [formatBytes(0, 2)],
        dates: [],
        count: 0,
      };

      dataObj.incomplete = {
        frames: '-',
        names: [],
        fsNames: [],
        size: formatBytes(0, 2),
        sizes: [formatBytes(0, 2)],
        dates: [],
        count: 0,
      };

      return dataObj;
    } // error

    var frame;
    var name = (
      decodeURI(omItem.file.name).slice(0, (dataObj.padding + 2 + 4) * (-1))
    );
    var fname = '';
    var fsName;

    var notmissingNames = [];
    var notmissingFrames = [];
    var notmissingfsNames = [];
    var notmissingSizes = [];
    var notmissingDates = [];

    var existsNames = [];
    var existsFrames = [];
    var existsfsNames = [];
    var existsSizes = [];
    var existsDates = [];

    var missingNames = [];
    var missingFrames = [];
    var missingfsNames = [];

    var partialNames = [];
    var partialFrames = [];
    var partialfsNames = [];
    var partialSizes = [];
    var partialDates = [];

    var size = 0;
    var formattedSize = 0;

    // Image sequence
    if (dataObj.padding > 0) {
      var progressbar = new PBar(dataObj.duration + dataObj.startframe);
      var n = 100;
      progressbar.show();

      for (
        var i = dataObj.startframe;
        i <= dataObj.duration + dataObj.startframe;
        i++
      ) {
        // Progress bar
        if (i % n === (n - 1)) {
          progressbar.hit(i);
          progressbar.update();
        }

        frame = pad(i, dataObj.padding);
        fname = name + frame + '.' + dataObj.ext;
        fsName = omItem.file.parent.fsName + sep + fname;

        if (files.hasOwnProperty(fname)) {
          notmissingNames.push(fname);
          notmissingFrames.push(i);
          notmissingfsNames.push(fsName);
          notmissingSizes.push(formatBytes(files[fname].size, 2));
          notmissingDates.push(files[fname].date + ' ' + files[fname].time);

          if (files[fname].size > 50) {
            existsNames.push(fname);
            existsFrames.push(i);
            existsfsNames.push(fsName);
            existsSizes.push(formatBytes(files[fname].size, 2));
            existsDates.push(files[fname].date + ' ' + files[fname].time);
            size += files[fname].size;
          } else {
            partialNames.push(fname);
            partialFrames.push(i);
            partialfsNames.push(fsName);
            partialSizes.push(formatBytes(files[fname].size, 2));
            partialDates.push(files[fname].date + ' ' + files[fname].time);
          }
        } else {
          missingNames.push(fname);
          missingFrames.push(i);
          missingfsNames.push(fsName);
        }
      }; // end of loop

      progressbar.palette().size = [1, 1];
      progressbar.close();
      formattedSize = formatBytes(size, 2);

      dataObj.exists = {
        frames: getRanges(notmissingFrames),
        names: notmissingNames,
        fsNames: notmissingfsNames,
        size: formattedSize,
        sizes: notmissingSizes,
        dates: notmissingDates,
        count: notmissingFrames.length,
      };
      dataObj.rendered = {
        frames: getRanges(existsFrames),
        names: existsNames,
        fsNames: existsfsNames,
        size: formattedSize,
        sizes: existsSizes,
        dates: existsDates,
        count: existsNames.length,
      };

      dataObj.missing = {
        frames: getRanges(missingFrames),
        names: missingNames,
        fsNames: missingfsNames,
        size: formatBytes(0, 2),
        sizes: [],
        dates: [],
        count: missingNames.length,
      };
      dataObj.incomplete = {
        frames: getRanges(partialFrames),
        names: partialNames,
        fsName: partialfsNames,
        size: formatBytes(0, 2),
        sizes: partialSizes,
        dates: partialDates,
        count: partialNames.length,
      };
    // Movies
    } else {
      frame = 1;
      fname = decodeURI(omItem.file.name);
      fsName = omItem.file.parent.fsName + sep + name;

      if (files.hasOwnProperty(fname)) {
        notmissingNames.push(name);
        notmissingFrames.push(frame);
        notmissingfsNames.push(fsName);
        notmissingSizes.push(formatBytes(files[fname].size, 2));
        notmissingDates.push(files[fname].date + ' ' + files[fname].time);

        if (files[fname].size > 50) {
          existsNames.push(fname);
          existsFrames.push(frame);
          existsfsNames.push(fsName);
          existsSizes.push(formatBytes(files[fname].size, 2));
          existsDates.push(files[fname].date + ' ' + files[fname].time);
          size += files[fname].size;
        } else {
          partialNames.push(fname);
          partialFrames.push(frame);
          partialfsNames.push(fsName);
          partialSizes.push(formatBytes(files[fname].size, 2));
          partialDates.push(files[fname].date + ' ' + files[fname].time);
        }
      } else {
        missingNames.push(fname);
        missingFrames.push(frame);
        missingfsNames.push(fsName);
      }

      formattedSize = formatBytes(size, 2);
      dataObj.exists = {
        frames: 1,
        names: [files.items[0].name],
        fsNames: notmissingfsNames,
        size: formattedSize,
        sizes: notmissingSizes,
        dates: notmissingDates,
        count: notmissingFrames.length,
      };

      dataObj.rendered = {
        frames: getRanges(existsFrames),
        names: existsNames,
        fsNames: existsfsNames,
        size: formattedSize,
        sizes: existsSizes,
        dates: existsDates,
        count: existsNames.length,
      };

      dataObj.missing = {
        frames: getRanges(missingFrames),
        names: missingNames,
        fsNames: missingfsNames,
        size: formatBytes(0, 2),
        sizes: [],
        dates: [],
        count: missingNames.length,
      };

      dataObj.incomplete = {
        frames: getRanges(partialFrames),
        names: partialNames,
        fsName: partialfsNames,
        size: formatBytes(0, 2),
        sizes: partialSizes,
        dates: partialDates,
        count: partialNames.length,
      };
    }
    return dataObj;
  }

  var cls = function() {
    var cls = this;
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
        var rqItem = app.project.renderQueue.item(i);
        var omItem = rqItem.outputModule(j);

        dataObj = {};
        dataObj.projectName = app.project.name;

        if (!(omItem.file)) {
          var fsName = getSetting('pathcontrol_fsName');
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

        dataObj.filename = null;

        dataObj.sequencename = null;
        dataObj.ext = null;
        dataObj.padding = null;
        dataObj.startframe = null;
        dataObj.endframe = null;
        dataObj.duration = null;

        dataObj.exists = {
          frames: null,
          names: null,
          fsNames: null,
          size: null,
          sizes: null,
          dates: null,
          count: null,
        };

        dataObj.rendered = {
          frames: null,
          names: null,
          fsNames: null,
          size: null,
          sizes: null,
          dates: null,
          count: null,
        };

        dataObj.missing = {
          frames: null,
          names: null,
          fsNames: null,
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

    this.filenames = function() {
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
            arr.push(DATA[i].filename);
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
        fsNames: [],
        sizes: [],
        counts: [],
      };

      if (isObjectEmpty(DATA)) {
        return returnObj;
      } else {
        for (var i = 0; i < keys.length; i++) {
          returnObj.frames.push(DATA[i].rendered.frames);
          returnObj.names.push(DATA[i].rendered.names);
          returnObj.fsNames.push(DATA[i].rendered.fsNames);
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
        fsNames: [],
        counts: [],
      };

      if (isObjectEmpty(DATA)) {
        return returnObj;
      } else {
        for (var i = 0; i < keys.length; i++) {
          returnObj.frames.push(DATA[i].missing.frames);
          returnObj.names.push(DATA[i].missing.names);
          returnObj.fsNames.push(DATA[i].missing.fsNames);
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
        fsNames: [],
        counts: [],
      };

    if (isObjectEmpty(DATA)) {
        return returnObj;
      } else {
        for (var i = 0; i < keys.length; i++) {
          returnObj.frames.push(DATA[i].incomplete.frames);
          returnObj.names.push(DATA[i].incomplete.names);
          returnObj.fsNames.push(DATA[i].incomplete.fsNames);
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
        fsNames: [],
        counts: [],
      };

      if (isObjectEmpty(DATA)) {
        return returnObj;
      } else {
        for (var i = 0; i < keys.length; i++) {
          returnObj.frames.push(DATA[i].exists.frames);
          returnObj.names.push(DATA[i].exists.names);
          returnObj.fsNames.push(DATA[i].exists.fsNames);
          returnObj.counts.push(DATA[i].exists.count);
        }
        return returnObj;
      }
    };
    this.setData();
  };
  return cls;
}();
