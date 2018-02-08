/**
 * Data class
 * @return {[type]} [description]
 */
var Data = function() {
  var DATA;

  /**
   * Private convenience function that populates the dataObj.
   * @param {object} dataObj The dataObject to populate.
   * @param {outputModule} rqItem  outputModule.
   * @param {renderQueueItem} omItem  renderQueueItem.
   * @return {object} dataObj  populated dataObject.
   */
  function setData(dataObj, rqItem, omItem) {
     var omFile = omItem.file;
     var omName = omFile.name;
     var omParentFsName = omFile.parent.fsName;

    if (!(dataObj.ready && omFile)) {
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

    dataObj.padding = getPadding(omName);
    dataObj.ext = omName.slice(-3);
    if (!dataObj.padding) {
      dataObj.sequencename = (
        decodeURI(decodeURI(omName)) + ' ' + '[' +
        pad(dataObj.startframe, dataObj.padding) + '-' +
        pad(dataObj.endframe, dataObj.padding) + ']'
      );
    } else {
      dataObj.sequencename = (
        decodeURI(decodeURI(omName).slice(
          0, ((dataObj.padding + 2 + 4) * (-1)))) +
        '[' + pad(dataObj.startframe, dataObj.padding) + '-' +
        pad(dataObj.endframe, dataObj.padding) + ']' + '.' + dataObj.ext
      );
    };

    dataObj.filename = (
      decodeURI(omFile.parent.name) +
      sep +
      decodeURI(dataObj.sequencename)
    );

    var stat = new Directory(omFile.parent);
    var files;

    if (dataObj.padding > 0) {
      files = stat.files('*.' + dataObj.ext);
    } else {
      files = stat.files(omFile.displayName);
    }

    if (files.item(0).name == ('Invalid path.' || 'Error.')) {
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
    }

    var frame;
    var name;
    var names = files.names;
    var fsName;
    var index;
    var file;
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

    if (dataObj.padding > 0) {
      var sframe = parseInt(dataObj.startframe, 10);
      var dframe = parseInt(dataObj.duration, 10);

      for (var i = sframe; i <= dframe + sframe; i++) {
        frame = pad(i, dataObj.padding);
        name = (
          decodeURI(omName).slice(0, (dataObj.padding + 2 + 4) * (-1)) +
          frame + '.' + dataObj.ext
        );
        index = names.indexOf(name);
        file = files.item(index);
        fsName = omParentFsName + sep + name;
        if (index >= 0) {
          notmissingNames.push(name);
          notmissingFrames.push(parseInt(frame, 10));
          notmissingfsNames.push(fsName);
          notmissingSizes.push(formatBytes(file.size, 2));
          notmissingDates.push(file.date + ' ' + file.time);

          if (files.sizes[index] > 50) {
            existsNames.push(name);
            existsFrames.push(parseInt(frame, 10));
            existsfsNames.push(fsName);
            existsSizes.push(formatBytes(file.size, 2));
            existsDates.push(file.date + ' ' + file.time);
            size += file.size;
          } else {
            partialNames.push(name);
            partialFrames.push(parseInt(frame, 10));
            partialfsNames.push(fsName);
            partialSizes.push(formatBytes(file.size, 2));
            partialDates.push(file.date + ' ' + file.time);
          }
        } else if (index == -1) {
          missingNames.push(name);
          missingFrames.push(parseInt(frame, 10));
          missingfsNames.push(fsName);
        }
      } // end of loop
      dataObj.exists = {
        frames: getRanges(notmissingFrames),
        names: notmissingNames,
        fsNames: notmissingfsNames,
        size: formatBytes(size, 2),
        sizes: notmissingSizes,
        dates: notmissingDates,
        count: notmissingFrames.length,
      };
      dataObj.rendered = {
        frames: getRanges(existsFrames),
        names: existsNames,
        fsNames: existsfsNames,
        size: formatBytes(size, 2),
        sizes: existsSizes,
        dates: existsDates,
        count: existsNames.length,
      };

      dataObj.missing = {
        frames: getRanges(missingFrames),
        names: missingNames,
        fsNames: missingfsNames,
        size: 0,
        sizes: [],
        dates: [],
        count: missingNames.length,
      };
      dataObj.incomplete = {
        frames: getRanges(partialFrames),
        names: partialNames,
        fsName: partialfsNames,
        size: 0,
        sizes: partialSizes,
        dates: partialDates,
        count: partialNames.length,
      };
    } else {
      frame = 1;
      name = decodeURI(omName);
      index = names.indexOf(name);
      fsName = omParentFsName + sep + name;

      if (index >= 0) {
        notmissingNames.push(name);
        notmissingFrames.push(parseInt(frame, 10));
        notmissingfsNames.push(fsName);
        notmissingSizes.push(formatBytes(file.size, 2));
        notmissingDates.push(file.date + ' ' + file.time);
        if (files.sizes[index] > 50) {
          existsNames.push(name);
          existsFrames.push(parseInt(frame, 10));
          existsfsNames.push(fsName);
          existsSizes.push(formatBytes(file.size, 2));
          existsDates.push(file.date + ' ' + file.time);
          size += file.size;
        } else {
          partialNames.push(name);
          partialFrames.push(parseInt(frame, 10));
          partialfsNames.push(fsName);
          partialSizes.push(formatBytes(file.size, 2));
          partialDates.push(file.date + ' ' + file.time);
        }
      }

      if (index == -1) {
        missingNames.push(name);
        missingFrames.push(parseInt(frame, 10));
        missingfsNames.push(fsName);
      }

      dataObj.exists = {
        frames: 1,
        names: [files.items[0].name],
        fsNames: notmissingfsNames,
        size: formatBytes(size, 2),
        sizes: notmissingSizes,
        dates: notmissingDates,
        count: notmissingFrames.length,
      };

      dataObj.rendered = {
        frames: getRanges(existsFrames),
        names: existsNames,
        fsNames: existsfsNames,
        size: formatBytes(size, 2),
        sizes: existsSizes,
        dates: existsDates,
        count: existsNames.length,
      };

      dataObj.missing = {
        frames: getRanges(missingFrames),
        names: missingNames,
        fsNames: missingfsNames,
        size: 0,
        sizes: [],
        dates: [],
        count: missingNames.length,
      };

      dataObj.incomplete = {
        frames: getRanges(partialFrames),
        names: partialNames,
        fsName: partialfsNames,
        size: 0,
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

    this.setData = function() {
      var dataObj = {};

      var rqItem;
      var omItem;

      dataObj.projectName = app.project.name;

      DATA = [];

      for (var i = 1; i <= app.project.renderQueue.numItems; i++) {
        rqItem = app.project.renderQueue.item(i);

        for (var j = 1; j <= rqItem.numOutputModules; j++) {
          omItem = rqItem.outputModule(j);
          dataObj = {};

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
              return true;
            } else if (rqItem.status == RQItemStatus.DONE) {
              return false;
            };
          }();

          dataObj.rqIndex = i;
          dataObj.omIndex = j;
          dataObj.comp = rqItem.comp;
          dataObj.compname = dataObj.comp.name;

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



          dataObj = setData(dataObj, rqItem, omItem);
          DATA.push(dataObj);
        }
      }
    };

    this.item = function(index) {
      return DATA[index];
    };

    this.compnames = function() {
      var arr = [];
      if (DATA.length === 0) {
        arr = ['No active output modules found.'];
        return arr;
      } else {
        for (var i = 0; i < DATA.length; i++) {
          arr.push(DATA[i].compname);
        }
        return arr;
      }
    };

    this.filenames = function() {
      var arr = [];
      if (DATA.length === 0) {
        arr = ['No active output modules found'];
        return arr;
      } else {
        for (var i = 0; i < DATA.length; i++) {
          if (DATA[i].file) {
            arr.push(DATA[i].filename);
          } else {
            arr.push('Unqueued');
          }
        }
        return arr;
      }
    };

    this.rendered = function() {
      var returnObj = {
        frames: [],
        names: [],
        fsNames: [],
        sizes: [],
        counts: [],
      };

      if (DATA.length === 0) {
        return returnObj;
      } else {
        for (var i = 0; i < DATA.length; i++) {
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
      var returnObj = {
        frames: [],
        names: [],
        fsNames: [],
        counts: [],
      };

      var frames = [];
      var names = [];
      var fsNames = [];
      var counts = [];

      if (DATA.length === 0) {
        return returnObj;
      } else {
        for (var i = 0; i < DATA.length; i++) {
          frames.push(DATA[i].missing.frames);
          names.push(DATA[i].missing.names);
          fsNames.push(DATA[i].missing.fsNames);
          counts.push(DATA[i].missing.count);
        }
        returnObj.frames = frames;
        returnObj.names = names;
        returnObj.fsNames = fsNames;
        returnObj.counts = counts;

        return returnObj;
      }
    };

    this.incomplete = function() {
      var returnObj = {
        frames: [],
        names: [],
        fsNames: [],
        counts: [],
      };

      var frames = [];
      var names = [];
      var fsNames = [];
      var counts = [];

      if (DATA.length === 0) {
        return returnObj;
      } else {
        for (var i = 0; i < DATA.length; i++) {
          frames.push(DATA[i].incomplete.frames);
          names.push(DATA[i].incomplete.names);
          fsNames.push(DATA[i].incomplete.fsNames);
          counts.push(DATA[i].incomplete.count);
        }
        returnObj.frames = frames;
        returnObj.names = names;
        returnObj.fsNames = fsNames;
        returnObj.counts = counts;

        return returnObj;
      }
    };

    this.exists = function() {
      var returnObj = {
        frames: [],
        names: [],
        fsNames: [],
        counts: [],
      };

      var frames = [];
      var names = [];
      var fsNames = [];
      var counts = [];

      if (DATA.length === 0) {
        return returnObj;
      } else {
        for (var i = 0; i < DATA.length; i++) {
          frames.push(DATA[i].exists.frames);
          names.push(DATA[i].exists.names);
          fsNames.push(DATA[i].exists.fsNames);
          counts.push(DATA[i].exists.count);
        }
        returnObj.frames = frames;
        returnObj.names = names;
        returnObj.fsNames = fsNames;
        returnObj.counts = counts;

        return returnObj;
      }
    };
  };
  return cls;
}();
