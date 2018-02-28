
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

var GUMROAD_LICENCE = function() {
  var API = 'https://api.gumroad.com/v2/licenses/verify';
  var PRODUCT_ID = 'LQdjx';

  var dataObj = {
    'success': false,
    'uses': 0,
    'purchase': {
      'id': '',
      'email': '',
      'created_at': '',
      'product_name': SCRIPT_NAME,
      'variants': '',
      'custom_fields': [],
      'offer_code': {
        'name': '',
        'displayed_amount_off': '',
      },
      'chargebacked': false,
      'refunded': false,
    },
  };

  var cls = function(EMAIL, LICENCE_KEY) {
    var cls = this;

    this.key = LICENCE_KEY;
    this.email = EMAIL;

    this.bin = function() {
      var f;
      if (File.fs === 'Windows') {
        f = new File(SCRIPT_FILE.parent.absoluteURI + '/RenderQueuePlus/bin/curl.exe');
      } else {
        // OS X not implemented
        f = new File(SCRIPT_FILE.parent.absoluteURI + '/RenderQueuePlus/bin/curl.exe');
      }
      return f;
    }();

    this.bin_exists = function() {
      return cls.bin.exists;
    }();

    this.cmd = function() {
      if (cls.bin_exists) {
        return (
          '"' + cls.bin.fsName + '" --insecure' +
          ' ' + API + ' ' +
          '-d "product_permalink=' + PRODUCT_ID + '"' + ' ' +
          '-d "license_key=' + LICENCE_KEY + '"'
        );
      } else {
        return null;
      }
    }();

    this.getLicenceStatus = function() {
      if (!cls.bin_exists) {
        Window.alert(
          'Error verifying the licence.\n' +
          'The cURL bin could not be found.',
          SCRIPT_NAME + ': Missing component'
        );
        return dataObj;
      }

      var call = cls.callSystem();

      var hostError = /(Could not resolve host)/gi;
      var sslError = /(SSL certificate problem)/gi;
      var apiNotFoundError = /(404)/gi;
      var json = /(\{)(.*)(\})/gi;
      var invalidLicence = /(license does not exist)/gi;
      var validLicence = /(\"success\"\:true)/gi;

      if (hostError.test(call)) {
        Window.alert(
          'Sorry, could not verify the licence.\n' +
          'Unable to resolve the host.',
          SCRIPT_NAME + ': Connection problem'
        );
        return dataObj;
      }
      // certificate error
      if (sslError.test(call)) {
        Window.alert(
          'Sorry, could not verify the licence.\n' +
          'There is a problem with the SSL certificate.',
          SCRIPT_NAME + ': SSL Certificate Problem'
        );
        return dataObj;
      } else if (apiNotFoundError.test(call)) {
        Window.alert(
          'Error connecting to the gumroad licensing service.\n' +
          API + ' not found.',
          SCRIPT_NAME + ': 404'
        );

        // curl connected
      } else if (json.test(call)) {
        if (invalidLicence.test(call)) {
          Window.alert(
            'Sorry, could not verify your licence. The key is invalid.',
            SCRIPT_NAME + ': Invalid Licence'
          );
          return dataObj;
        }
        if (validLicence.test(call)) {
          var validDataObj = JSON.parse(call.match(json)[0]);

          // has the licence been charged back?
          if (validDataObj.purchase.chargeback === true) {
            Window.alert(
              'The has been invalidated as there has been a charge-back on this purchace.',
              SCRIPT_NAME + ': Invalid licence key'
            );
            validDataObj.success = false;
            return validDataObj;
          }
          return validDataObj;
        }
      } else {
        return dataObj;
      }
    };
  };

  cls.prototype = {
    callSystem: function() {
      return system.callSystem(this.cmd);
    },
    verify: function() {
      var dataObj = this.getLicenceStatus();
      if (dataObj.success && !(this.email == dataObj.purchase.email)) {
        Window.alert(
          'The licence key and the email address don\'t seem to match.',
          SCRIPT_NAME + ': Invalid email'
        );
        return false;
      }
      if (dataObj.success && (this.email == dataObj.purchase.email)) {
        return true;
      }
      return false;
    },
  };
  return cls;
}();


var LOCAL_LICENCE = function() {
  var LICENSE_FILE = new File(
    TEMP_DIR.absoluteURI + '/gumroad.lic'
  );

  var cls = function() {
    var cls = this;

    this.email = '';
    this.key = '';

    this.licence_file = LICENSE_FILE;

    this.exists = function() {
      return LICENSE_FILE.exists;
    }();


    this.read = function() {
      var raw;
      var email = '';
      var key = '';

      var re1 = /(email\=)(.*)/i;
      var re2 = /(lic\=)(.*)/i;

      if (!cls.exists) {
        return ['', ''];
      };

      LICENSE_FILE.open('r');
      raw = LICENSE_FILE.read();
      LICENSE_FILE.close();

      if (raw.length === 0) {
        return ['', ''];
      }

      if (re1.test(raw)) {
        if (raw.match(re1)[2]) {
          email = raw.match(re1)[2];
        } else {
          email = '';
        }
      }

      if (re2.test(raw)) {
        if (raw.match(re2)[2]) {
          key = raw.match(re2)[2];
        } else {
          key = '';
        }
      }

      cls.email = email;
      cls.key = key;
      return [email, key];
    };

    this.write = function() {
      LICENSE_FILE.open('w');
      var result = LICENSE_FILE.write(
        'email=' + cls.email +
        '\n' +
        'lic=' + cls.key
      );
      LICENSE_FILE.close();

      if (result) {
        Window.alert(
          'Licence set successfully.',
          SCRIPT_NAME + ': Success'
        );
        return true;
      } else {
        Window.alert(
          'An error occured writing the licence file.',
          SCRIPT_NAME + ': Error'
        );
        return;
      }
    };
  };


  cls.prototype = {};

  return cls;
}();


var ENTER_LICENCE = function() {
  var WIDTH = 400;
  var HEIGHT = 500;

  var cls = function() {
    var cls = this;

    this.createUI = function() {
      var w = new Window('dialog', SCRIPT_NAME + ': Enter Licence Key', undefined, {
        resizeable: false,
      });
      w.alignChildren = 'center';
      w.margins = 18;
      w.spacing = 6;

      /**
       * Validates the entered licencing information
       * @return {Boolean} true if written successfully
       */
      function button_ok_onClick() {
        var lic_field = w.findElement('licenceField');
        var email_field = w.findElement('emailField');

        if (email_field.text.length === 0) {
          Window.alert(
            'You have to enter your email to continue.',
            SCRIPT_NAME
          );
          return;
        } else if (lic_field.text.length === 0) {
          Window.alert(
            'You have to enter your licence key to continue.',
            SCRIPT_NAME
          );
          return;
        }

        var glic = new GUMROAD_LICENCE(email_field.text, lic_field.text);
        var llic = new LOCAL_LICENCE();

        if (!glic.verify()) {
          return;
        } else {
          llic.email = email_field.text;
          llic.key = lic_field.text;

          var res = llic.write();

          if (res) {
            LICENSED = true;
            w.close();
            return true;
          } else {
            LICENSED = false;
            return false;
          }
        }
      };


      /**
       * Validates the entered licencing information
       */
      function button_cancel_onClick() {
        w.close();
      };

      var logo = new File(SCRIPT_FILE.parent.absoluteURI + '/RenderQueuePlus/icons/logo.png');
      var img = w.add(
        'image',
        undefined,
        logo
      );

      var emailGroup = w.add(
        'group',
        undefined, {
          name: 'emailGroup',
          orientation: 'row',
        }
      );
      emailGroup.margins = [6, 6, 0, 0];
      emailGroup.spacing = 6;
      emailGroup.alignChildren = ['left', 'top'];

      var emailLabel = emailGroup.add(
        'statictext',
        undefined,
        'Email: ', {
          name: 'emailLabel',
        }
      );
      emailLabel.margins = [0, 0, 0, 0];
      emailLabel.spacing = 0;
      emailLabel.size = [WIDTH * .2, 24];

      var emailField = emailGroup.add(
        'edittext',
        undefined,
        '', {
          multiline: false,
          name: 'emailField',
        }
      );
      emailField.helpTip = 'Enter your email address';
      emailField.size = [WIDTH * .8, 24];

      var licenceGroup = w.add(
        'group',
        undefined, {
          name: 'licenceGroup',
          orientation: 'row',
        }
      );
      licenceGroup.margins = [6, 6, 0, 0];
      licenceGroup.spacing = 6;
      licenceGroup.alignChildren = ['left', 'top'];

      var licenceLabel = licenceGroup.add(
        'statictext',
        undefined,
        'Licence key: ', {
          name: 'licenceLabel',
        }
      );
      licenceLabel.margins = [0, 0, 0, 0];
      licenceLabel.spacing = 0;
      licenceLabel.size = [WIDTH * .2, 24];

      var licenceField = licenceGroup.add(
        'edittext',
        undefined,
        '', {
          multiline: false,
          name: 'licenceField',
        }
      );
      licenceField.helpTip = 'Enter your licence key';
      licenceField.size = [WIDTH * .8, 24];

      var noLicenceGroup = w.add(
        'group',
        undefined, {
          name: 'noLicenceGroup',
          orientation: 'row',
        }
      );
      noLicenceGroup.margins = [6, 6, 0, 0];
      noLicenceGroup.spacing = 6;
      noLicenceGroup.alignChildren = ['left', 'top'];


      var noLicenceLabel = noLicenceGroup.add(
        'statictext',
        undefined,
        'Don\'t have a licence yet?', {
          name: 'noLicenceLabel',
        }
      );
      noLicenceLabel.margins = [0, 0, 0, 0];
      noLicenceLabel.spacing = 0;
      noLicenceLabel.size = [WIDTH * .6, 24];

      var aboutWebsite = noLicenceGroup.add(
        'button',
        undefined,
        'Get a licence', {
          name: 'aboutWebsite',
        }
      );
      aboutWebsite.size = [WIDTH * .2, 24];
      aboutWebsite.onClick = function() {
        openLink('https://gumroad.com/l/renderqueueplus');
      };

      var supportButton = noLicenceGroup.add(
        'button',
        undefined,
        'Support', {
          name: 'supportButton',
        }
      );
      supportButton.size = [WIDTH * .2, 24];
      supportButton.onClick = function() {
        openLink('mailto:hello@gergely-wootsch.com');
      };

      var footerGroup = w.add(
        'group',
        undefined, {
          orientation: 'row',
        }
      );
      footerGroup.alignChildren = ['left', 'top'];
      footerGroup.margins = 10;
      footerGroup.spacing = 0;

      var button_ok = footerGroup.add('button', undefined, 'Ok', {
        name: 'button_ok',
      });
      button_ok.size = [100, 20];
      button_ok.onClick = function() {
        try {
          button_ok_onClick();
        } catch (e) {
          catchError(e);
        };
      };

      var button_cancel = footerGroup.add('button', undefined, 'Cancel', {
        name: 'button_cancel',
      });
      button_cancel.size = [100, 20];
      button_cancel.onClick = function() {
        try {
          button_cancel_onClick();
        } catch (e) {
          catchError(e);
        };
      };
      return w;
    };

    this.show = function(licensee) {
      var w = cls.createUI();

      if (licensee) {
        w.findElement('emailField').text = licensee[0];
        w.findElement('licenceField').text = licensee[1];
      }

      w.layout.layout(true);
      w.show();
    };
  };
  cls.prototype = {};
  return cls;
}();
