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
* Module is responsible for setting the output path of the given Output Module.
* @type {outputModule} omItem:          The current output module.
*/
var Pathcontrol = function() {
  // Object to store our settings
  var om_properties = {};

  om_properties.extension = null;
  om_properties.customsuffix = null;

  om_properties.versionString = function() {
    return 'v' + pad(om_properties.version, 3);
  };

  om_properties.paddingString = function() {
    if (om_properties.padding == 0) {
      return '';
    } else {
      return '[' + Array(om_properties.padding + 1).join('#') + ']';
    }
  };

  om_properties.version = null;
  om_properties.padding = null;
  om_properties.basepath = null;
  om_properties.template = null;

  om_properties.om = function() {
    return ({
      'Output File Info': {
        'Base Path': om_properties.basepath,
        'File Template': om_properties.template,
      },
    });
  };


  var cls = function() {
    /*
    Takes an Output Module as an argument and expands its settings.
     */
    this.initFromOutputModule = function(omItem) {
      var settings = omItem.getSettings(GetSettingsFormat.STRING_SETTABLE);
      var template = settings['Output File Info']['File Template'];
      var padding = getPadding(template);
      var version = getVersionNumberFromString(template);

      if (!padding) {
        padding = 0;
      }
      om_properties.padding = padding;
      om_properties.version = version;

      var returnObj = {};
      returnObj.padding = padding;
      returnObj.version = version;
      return returnObj;
    };

    this.setVersion = function(inNum) {
      om_properties.version = inNum;
      return om_properties.version;
    };

    this.setBasepath = function(inString) {
      om_properties.basepath = inString;
      return om_properties.basepath;
    };

    this.getVersionString = function() {
      return 'v' + pad(om_properties.version, 3);
    };

    this.getVersion = function() {
      return om_properties.version;
    };

    this.getPadding = function() {
      return om_properties.padding;
    };

    this.getVersions = function() {
      var baseFolder;
      var subFolders;
      var versionFolders = [];

      if (!om_properties.basepath) {
        return versionFolders;
      }

      baseFolder = new Folder(om_properties.basepath);

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

      if (getSetting('pathcontrol_path')) {
        var rendersBase = new Folder(
          getSetting('pathcontrol_path')
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
        if (om_properties.padding > 0) {
          om_properties.template = (
            om_properties.versionString() + '/' + fileNameSafeString(rqItem.comp.name) + '_' +
            om_properties.versionString() + '_' +
            om_properties.paddingString() + '.[fileExtension]'
          );
        }
        if (om_properties.padding == 0) {
          om_properties.template = (
            om_properties.versionString() + '/' + fileNameSafeString(rqItem.comp.name) + '_' +
            om_properties.versionString() + '.[fileExtension]'
          );
        }
      }

      try {
        omItem.setSettings(om_properties.om());
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
