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
