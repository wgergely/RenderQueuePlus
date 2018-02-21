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


var PBar = function() {
    var palette;

    var width = 350;
    var height = 100;
    var title = 'Checking sequence...';

    var statusText;
    var bar;

    var H = 22;
    var Y = (3 * height - 2 * H) >> 2;

  var cls = function(max) {
    var cls = this;

    this.max = max;

    this.pattern = ['%1'];

    this.hit = function(i) {
        bar.value = i;
        this.msg('Processing ' + String(i) + ' of ' + String(cls.max) + '...');
    };

    this.msg = function(s) {
        s && (
            statusText.location = [
                (width - statusText.graphics.measureString(s)[0]) >> 1,
                Y,
            ]
        );
        statusText.text = s;
    };

    this.createUI = function() {
      (60 <= (width || 0)) || (width = 340);
      (40 <= (height || 0)) || (height = 60);

      palette = new Window(
        'palette',
        title,
        undefined,
        {
          borderless: true,
          resizeable: false,
        }
      );
      palette.size = [width, height];

      bar = palette.add(
        'progressbar', {
          x: 20,
          y: height >> 2,
          width: width - 40,
          height: 12,
        },
        0,
        100
      );

      statusText = palette.add(
        'statictext',
        {
          name: 'statusText',
          x: 0,
          y: Y,
          width: width,
          height: H,
        }
      );

        bar.value = 0;
        bar.maxvalue = cls.max || 0;
        bar.visible = !!cls.max;

        palette.layout.layout(true);
        palette.update();
    }();

    this.palette = function() {
      return palette;
    };

    this.show = function() {
        palette.show();
        palette.center();
    };

    this.hide = function() {
        palette.hide();
    };

    this.close = function() {
        palette.close();
    }
    ;
    this.update = function() {
        palette.layout.layout(true);
        palette.update();
    };
  };
  return cls;
}();
