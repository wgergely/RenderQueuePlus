/**
* Module is responsible for setting the output path
* @type {outputModule} omItem - the current output module
*/
var Pathcontrol = function() {
  var props = {};

  props.extension = null;
  props.customsuffix = null;

  props.versionString = function() {
    return 'v' + pad(props.version, 3);
  };

  props.paddingString = function() {
    if (props.padding == 0) {
      return '';
    };
    if (props.padding == 1) {
      return '[#]';
    };
    if (props.padding == 2) {
      return '[##]';
    };
    if (props.padding == 3) {
      return '[###]';
    };
    if (props.padding == 4) {
      return '[####]';
    };
    if (props.padding == 5) {
      return '[#####]';
    };
  };
  props.version = null;
  props.padding = null;
  props.basepath = null;
  props.template = null;

  props.om = function() {
    return ({
      'Output File Info': {
        'Base Path': props.basepath,
        'File Template': props.template,
      },
    });
  };


  var cls = function() {
    this.initFromOutputModule = function(omItem) {
      var settings = omItem.getSettings(GetSettingsFormat.STRING_SETTABLE);
      var template = settings['Output File Info']['File Template'];
      var padding = getPadding(template);
      var version = getVersionNumberFromString(template);

      if (!padding) {
        padding = 0;
      }
      props.padding = padding;
      props.version = version;

      var returnObj = {};
      returnObj.padding = padding;
      returnObj.version = version;
      return returnObj;
    };

    this.setVersion = function(inNum) {
      props.version = inNum;
      return props.version;
    };

    this.setBasepath = function(inString) {
      props.basepath = inString;
      return props.basepath;
    };

    this.getVersionString = function() {
      return 'v' + pad(props.version, 3);
    };

    this.getVersion = function() {
      return props.version;
    };

    this.getPadding = function() {
      return props.padding;
    };

    this.getVersions = function() {
      var baseFolder;
      var subFolders;
      var versionFolders = [];

      if (!props.basepath) {
        return versionFolders;
      }

      baseFolder = new Folder(props.basepath);

      if (!baseFolder.exists) {
        return versionFolders;
      }

      var subFolders = baseFolder.getFiles(function(elem) {
        if (elem instanceof Folder) {
          return true;
        } else {
          return false;
        }
      });

      for (var i = 0; i < subFolders.length; i++) {
        if (subFolders[i].displayName.match(/v\d\d\d/gi)) {
          versionFolders.push(subFolders[i]);
        }
      }
      return versionFolders;
    };

    this.apply = function(item) {
      var omItem = data.getOutputModule(
        data.item(listItem.selection.index).rqIndex,
        data.item(listItem.selection.index).omIndex
      );
      var rqItem = app.project.renderQueue.item(
        data.item(listItem.selection.index).rqIndex
      );

      var foldersOK = false;

      if (getSetting('pathcontrol_fsName')) {
        var rendersBase = new Folder(
          getSetting('pathcontrol_fsName')
        );
        try {
          rendersBase.create();
          foldersOK = true;
        } catch (e) {
          foldersOK = false;
          var text = 'Sorry, Unable to create render base folder:';
          text += '\n\n\n' + e;
          Window.alert(text, SCRIPT_NAME + ': Versions Error');
        }
      } else {
        var text = 'The output base path has not been set.';
        text += '\nCheck the panel preferences if you have ';
        text += 'a valid pattern set.\n\nNote: You can still set ';
        text += 'the destination manually in the Render Queue.';
        Window.alert(text, SCRIPT_NAME);
      }

      if (foldersOK) {
        if (props.padding > 0) {
          props.template = (
            props.versionString() + '/' + fileNameSafeString(rqItem.comp.name) + '_' +
            props.versionString() + '_' +
            props.paddingString() + '.[fileExtension]'
          );
        }
        if (props.padding == 0) {
          props.template = (
            props.versionString() + '/' + fileNameSafeString(rqItem.comp.name) + '_' +
            props.versionString() + '.[fileExtension]'
          );
        }
      }

      try {
        omItem.setSettings(props.om());
      } catch (e) {
        var text = 'Sorry, unable to set output module path.';
        text += '\n\nMake sure the module is queued and ready';
        text += ' to render in the Render Queue.';
        Window.alert(text, SCRIPT_NAME + ': Invalid Render Queue Item Status.');
      }
    };
  };
  return cls;
}();
