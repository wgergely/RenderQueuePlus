
var ICON_FILES = {};

/**
 * Populates the ICON_FILES directory
 */
(function initIcons() {
  var uri = scriptFile.parent.absoluteURI;
  var dir = new Folder(uri + '/icons');
  var files = dir.getFiles('*.png');
  for (var i = 0; i < files.length; i++) {
    displayName = files[i].displayName;
    displayName = displayName.slice(0, -4);
    ICON_FILES[displayName] = files[i];
  };
})();
