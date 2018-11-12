var FFMPEG = function() {
  var re = /(dpx)|(gif)|(jpg)|(targa)|(tga)|(sgi)|(tiff)|(tif)|(png)|(exr)|(psd)/gi;

  var ffmpeg_cmd = '"[ffmpeg]" -y -hide_banner -loglevel info -f image2 -framerate [framerate] -s [width]x[height]' +
  ' -i "[basepath]' + '/' + '[basename][padding].[ext]" [frameoverlay] -start_number [start]' +
  ' -frames:v [duration] [customOptions] "[output]"';

  var ffmpeg_overlay = '-vf "drawtext=fontfile=/Windows/Fonts/Arial.ttf: text=[text]%%{eif\\\\:n+[start]\\\\:d}: x=(w-tw)/2: y=h-(2*lh): fontcolor=white: box=1: boxcolor=0x00000099"';

  var cls = function(path) {
    var cls = this;
  };

  cls.prototype = {
    isSequence: function(path) {
      return re.test(path);
    },

    getOverlay: function(dataItem) {
      return ffmpeg_overlay.
        replace(/\[text\]/g, String(dataItem.basename)).
        replace(/\[start\]/g, String(dataItem.startframe));
    },

    getCommand: function(dataItem, output) {
      if (!cls.prototype.isSequence(dataItem.ext)) {
        return null;
      }

      if (!(getSetting('ffmpeg_bin') && getSetting('ffmpeg_call'))) {
        return null;
      }
      var baseFolder = new File(dataItem.basepath);
      return ffmpeg_cmd.
        replace(/\[ffmpeg\]/g, String(getSetting('ffmpeg_bin'))).
        replace(/\[framerate\]/g, String(dataItem.framerate)).
        replace(/\[width\]/g, String(dataItem.width)).
        replace(/\[height\]/g, String(dataItem.height)).
        replace(/\[basepath\]/g, String(baseFolder.fsName)).
        replace(/\[basepathParent\]/g, String(baseFolder.parent.fsName)).
        replace(/\[basename\]/g, String(dataItem.basename)).
        replace(/\[padding\]/g, '%%' + pad(dataItem.padding, 2) + 'd').
        replace(/\[ext\]/g, String(dataItem.ext)).
        replace(/\[frameoverlay\]/g, cls.prototype.getOverlay(dataItem)).
        replace(/\[start\]/g, String(dataItem.startframe)).
        replace(/\[duration\]/g, String(dataItem.duration)).
        replace(/\[customOptions\]/g, String(getSetting('ffmpeg_call'))).
        replace(/\[output\]/g, String(output));
    },

    getBin: function() {
      return getSetting('ffmpeg_bin');
    },

    callSystem: function() {
      if (!ffmpeg_cmd) {
        return;
      }

      if (!(File.fs === 'Windows')) {
        return;
      }

      var cmd = 'cmd /c "' + this.ffmpeg_cmd + '"';
      var call;
      call = system.callSystem(cmd);
      return call;
    },
  };

  return cls;
}();
