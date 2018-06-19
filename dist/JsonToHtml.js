"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var JsonToHtml = function () {
  var html = '';
  var level = 0;
  var rootClass = '';
  var suffix = '&nbsp;&nbsp;';
  var jsonObjOrig;
  var subLevel = 0;
  var componentLevel = 0;

  var getTable = function getTable(jsonObj, replacer, arrayRenderStyle) {
    html = '<table class="jsonTable">';
    jsonObjOrig = jsonObj;
    level = 0;
    walkTheDog(jsonObj, replacer, arrayRenderStyle);
    html += '</table>';
    return html;
  };

  var getIndent = function getIndent(level) {
    var indent = '&nbsp;&nbsp;';

    for (var i = 0; i < level; i++) {
      indent += '&nbsp;&nbsp;&nbsp;';
    }

    return indent;
  }; // TODO: This is such a hack, but css border-spacing is simply not working


  var getSpacer = function getSpacer() {
    return ''; // return '<tr style="height:2px"></tr>';
  };

  var processArray = function processArray(arr, replacer) {
    var distKeys = [];
    var html = '';

    if (Array.isArray(arr) && arr.length === 0) {
      return html;
    } // Get distinct keys from first obj
    // TODO: Handle unstructured objects in array. Assumption, for now, is that
    // all objects in array will have same structure.


    if (_typeof(arr[0]) === 'object') {
      // Render the props if only a single object in the array
      if (arr.length === 1) {
        for (var k in arr[0]) {
          var value = ''; //console.log(arr[0][k], typeof arr[0][k] === 'object');

          if (_typeof(arr[0][k]) === 'object') {
            value = getTable(arr[0][k], replacer);
          } else {
            if (arr[0][k]) {
              value = arr[0][k].toString();
            }

            if (typeof replacer === 'function') {
              value = replacer(arr[0][k], value);
            }
          }

          html += '<tr class="jsonTable__row">';
          html += '<td class="jsonTable__element--sub" name="foo">' + getIndent(level) + k + suffix + '</td>';
          html += '<td class="jsonTable__dataCell">' + getIndent(level) + value + suffix + '</td>';
          html += '</tr>';
          html += getSpacer();
        }
      } else {
        html = '<tr class="jsonTable__row">';

        for (var j in arr[0]) {
          distKeys.push(j);
          html += '<td class="jsonTable__element--sub" name="bar">' + getIndent(level) + j + suffix + '</td>';
        }

        html += '</tr>';
        html += getSpacer(); // Render a row for each obj, displaying the value for each distinct key

        for (var l in arr) {
          html += '<tr class="jsonTable__row">';

          for (var i = 0; i < distKeys.length; i++) {
            var renderVal = arr[l][distKeys[i]];

            if (typeof replacer === 'function') {
              renderVal = replacer(distKeys[i], renderVal);
            }

            html += '<td  class="jsonTable__dataCell">' + getIndent(level) + renderVal + suffix + '</td>';
          }

          html += '</tr>';
          html += getSpacer();
        }
      }
    } // Render a <tr> and <td> for each string in an array


    if (typeof arr[0] === 'string') {
      for (var m in arr) {
        html += '<tr class="jsonTable__row">';
        html += '  <td class="jsonTable__dataCell" colspan="2">' + getIndent(level) + arr[m] + suffix + '</td>';
        html += '</tr>';
      }
    }

    return html;
  };

  var walkTheDog = function walkTheDog(jsonObj, replacer, arrayRenderStyle) {
    var hasArray = false;

    if (typeof jsonObj === 'string') {
      jsonObj = JSON.parse(jsonObj);
    }

    subLevel = level;

    for (var k in jsonObj) {
      // Reset the indent if next element is root
      // if (typeof jsonObjOrig[k] !== 'undefined') {
      //   level = 0;
      //   rootClass = 'jsonTable__element--root';
      // } else {
      //   rootClass = 'jsonTable__element--sub';
      // }
      rootClass = 'jsonTable__element--sub';
      componentLevel = subLevel;

      if (jsonObj.hasOwnProperty(k)) {
        var v = jsonObj[k];

        if (hasArray) {
          level = componentLevel;
        }

        console.log('renderVal ', level, k, v);

        if (_typeof(v) === 'object' && v !== null) {
          html += '<tr class="jsonTable__row"><td class="' + rootClass + '" colspan="3">' + getIndent(level) + k + suffix + '</td></tr>';
          html += getSpacer();
          level += 1;
        } else {
          var style = 'jsonTable__jsonTd jsonTable__dataCell';
          var renderVal = v;

          if (typeof replacer === 'function') {
            renderVal = replacer(k, v);
          }

          html += '<tr class="jsonTable__row"><td class="' + rootClass + '">' + getIndent(level) + k + suffix + '</td><td class="' + style + '" colspan="2">' + (renderVal === null ? '' : renderVal) + '</td></tr>';
          html += getSpacer();
        } //vertical array


        if (v instanceof Array) {
          if (arrayRenderStyle === 'vertical') {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = v[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var val = _step.value;
                html += '<tr class="jsonTable__row"><td colspan="2" class="jsonTable__columnSpacer">&nbsp;</td></tr>';
                walkTheDog(val, replacer);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          } else {
            // horizontal array
            if (v instanceof Array) {
              html += processArray(v, replacer);
              hasArray = true;
            }
          }
        }

        if (_typeof(v) === 'object' && !(v instanceof Array) && !(v == null)) {
          walkTheDog(v, replacer);
          level = subLevel - 1; // Outdent back
        }
      }
    }
  };

  return {
    getTable: getTable
  };
}();

var _default = JsonToHtml;
exports.default = _default;