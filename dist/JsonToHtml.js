'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _Css = require('./Css');

var _Css2 = _interopRequireDefault(_Css);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JsonToHtml = function () {
  var html = '';
  var level = 0;
  var rootClass = "";
  var suffix = '&nbsp;&nbsp;';
  var colspan = 2;
  var jsonObjOrig;

  var getTable = function getTable(jsonObj) {
    html = '<table cellspacing="1" style="border-spacing:2px">';
    jsonObjOrig = jsonObj;
    level = 0;
    walkTheDog(jsonObj);
    html += '</table>';
    return html;
  };

  var getIndent = function getIndent(level) {
    var indent = '&nbsp;&nbsp;';

    for (var i = 0; i < level; i++) {
      indent += '&nbsp;&nbsp;&nbsp;';
    }

    return indent;
  };

  // TODO: This is such a hack, but css border-spacing is simply not working
  var getSpacer = function getSpacer() {
    return '<tr style="height:2px"></tr>';
  };

  // Get the Css obj from Css.js, and return a semicolon separated list of styles
  var getStyleAttributes = function getStyleAttributes(className) {
    var cssObj = _Css2.default[className];
    var keys = Object.keys(cssObj);
    var attributes = "";

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var cssAttr = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      attributes += cssAttr + ":" + cssObj[key] + ";";
    }

    return attributes;
  };

  var processArray = function processArray(arr) {
    var distKeys = [];
    var html = '';

    if (Array.isArray(arr) && arr.length === 0) {
      return html;
    }

    // Get distinct keys from first obj
    // TODO: Handle unstructured objects in array. Assumption, for now, is that
    // all objects in array will have same structure.
    if (_typeof(arr[0]) === 'object') {
      // Render the props if only a single object in the array 
      if (arr.length === 1) {
        for (var k in arr[0]) {
          var value = "";

          if (arr[0][k]) {
            value = arr[0][k].toString();
          }

          html += '<tr style="height:25px">';
          html += '  <td style="' + getStyleAttributes('subElement') + '">' + getIndent(level) + k + suffix + '</td>';
          html += '  <td style="' + getStyleAttributes('dataCell') + '">' + getIndent(level) + value + suffix + '</td>';
          html += '</tr>';
          html += getSpacer();
        }
      } else {
        html = '<tr style="height:25px">';

        for (var k in arr[0]) {
          distKeys.push(k);
          html += '<td style="' + getStyleAttributes('subElement') + '">' + getIndent(level) + k + suffix + '</td>';
        }

        html += '</tr>';
        html += getSpacer();

        // Render a row for each obj, displaying the value for each distinct key
        for (var k in arr) {
          html += '<tr style="height:25px">';

          for (var i = 0; i < distKeys.length; i++) {
            html += '<td style="' + getStyleAttributes('dataCell') + '">' + getIndent(level) + arr[k][distKeys[i]] + suffix + '</td>';
          }
          html += '</tr>';
          html += getSpacer();
        }
      }
    }

    // Render a <tr> and <td> for each string in an array
    if (typeof arr[0] === 'string') {
      for (var k in arr) {
        html += '<tr style="height:25px">';
        html += '  <td style="' + getStyleAttributes('dataCell') + '" colspan="2">' + getIndent(level) + arr[k] + suffix + '</td>';
        html += '</tr>';
      }
    }

    return html;
  };

  var walkTheDog = function walkTheDog(jsonObj) {
    if (typeof jsonObj === 'string') {
      jsonObj = JSON.parse(jsonObj);
    }

    for (var k in jsonObj) {
      // Reset the indent if next element is root
      if (typeof jsonObjOrig[k] !== 'undefined') {
        level = 0;
        rootClass = getStyleAttributes('rootElement');
      } else {
        rootClass = getStyleAttributes('subElement');
      }

      if (jsonObj.hasOwnProperty(k)) {
        var v = jsonObj[k];

        if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') {
          colspan += level;
          html += '<tr style="height:25px"><td style="' + rootClass + '" colspan="3">' + getIndent(level) + k + suffix + '</td></tr>';
          html += getSpacer();
          level += 1;
        } else {
          var style = getStyleAttributes('jsonTd') + getStyleAttributes('dataCell');
          html += '<tr style="height:25px"><td style="' + rootClass + '">' + getIndent(level) + k + suffix + '</td><td style="' + style + '" colspan="2">' + v + '</td></tr>';
          html += getSpacer();
        }

        if (v instanceof Array) {
          html += processArray(v);
        }

        if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' && !(v instanceof Array)) {
          walkTheDog(v);
        }
      }
    }
  };

  return {
    getTable: getTable
  };
}();

exports.default = JsonToHtml;