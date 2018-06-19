var JsonToHtml = (function() {
  let html = '';
  let level = 0;
  let rootClass = '';
  const suffix = '&nbsp;&nbsp;';
  let jsonObjOrig;
  let subLevel = 0;
  let componentLevel = 0;

  const getTable = function(jsonObj, replacer, arrayRenderStyle) {
    html = '<table class="jsonTable">';
    jsonObjOrig = jsonObj;
    level = 0;
    walkTheDog(jsonObj, replacer,arrayRenderStyle);
    html += '</table>';
    return html;
  };

  const getIndent = function(level) {
    let indent = '&nbsp;&nbsp;';

    for (var i = 0; i < level; i++) {
      indent += '&nbsp;&nbsp;&nbsp;';
    }

    return indent;
  };

  // TODO: This is such a hack, but css border-spacing is simply not working
  const getSpacer = function() {
    return '';
    // return '<tr style="height:2px"></tr>';
  };

  var processArray = function(arr, replacer) {
    var distKeys = [];
    var html = '';

    if (Array.isArray(arr) && arr.length === 0) {
      return html;
    }

    // Get distinct keys from first obj
    // TODO: Handle unstructured objects in array. Assumption, for now, is that
    // all objects in array will have same structure.
    if (typeof arr[0] === 'object') {
      // Render the props if only a single object in the array
      if (arr.length === 1) {
        for (var k in arr[0]) {
          var value = '';

          //console.log(arr[0][k], typeof arr[0][k] === 'object');

          if (typeof arr[0][k] === 'object') {
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
          html +=
            '<td class="jsonTable__element--sub" name="foo">' +
            getIndent(level) +
            k +
            suffix +
            '</td>';
          html +=
            '<td class="jsonTable__dataCell">' +
            getIndent(level) +
            value +
            suffix +
            '</td>';
          html += '</tr>';
          html += getSpacer();
        }
      } else {
        html = '<tr class="jsonTable__row">';

        for (var j in arr[0]) {
          distKeys.push(j);
          html +=
            '<td class="jsonTable__element--sub" name="bar">' +
            getIndent(level) +
            j +
            suffix +
            '</td>';
        }

        html += '</tr>';
        html += getSpacer();

        // Render a row for each obj, displaying the value for each distinct key
        for (var l in arr) {
          html += '<tr class="jsonTable__row">';

          for (var i = 0; i < distKeys.length; i++) {
            let renderVal = arr[l][distKeys[i]];
            if (typeof replacer === 'function') {
              renderVal = replacer(distKeys[i], renderVal);
            }
            html +=
              '<td  class="jsonTable__dataCell">' +
              getIndent(level) +
              renderVal +
              suffix +
              '</td>';
          }
          html += '</tr>';
          html += getSpacer();
        }
      }
    }

    // Render a <tr> and <td> for each string in an array
    if (typeof arr[0] === 'string') {
      for (var m in arr) {
        html += '<tr class="jsonTable__row">';
        html +=
          '  <td class="jsonTable__dataCell" colspan="2">' +
          getIndent(level) +
          arr[m] +
          suffix +
          '</td>';
        html += '</tr>';
      }
    }
    return html;
  };

  var walkTheDog = function(jsonObj, replacer,arrayRenderStyle) {
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

        console.log('renderVal ',level, k,v);

        if (typeof v === 'object' && v !== null) {
          html +=
            '<tr class="jsonTable__row"><td class="' +
            rootClass +
            '" colspan="3">' +
            getIndent(level) +
            k +
            suffix +
            '</td></tr>';
          html += getSpacer();
          level += 1;
        } else {
          const style = 'jsonTable__jsonTd jsonTable__dataCell';
          let renderVal = v;
          if (typeof replacer === 'function') {
            renderVal = replacer(k, v);
            
          }

          html +=
            '<tr class="jsonTable__row"><td class="' +
            rootClass +
            '">' +
            getIndent(level) +
            k +
            suffix +
            '</td><td class="' +
            style +
            '" colspan="2">' +
            (renderVal === null ? '' : renderVal) +
            '</td></tr>';
          html += getSpacer();
        }

        //vertical array
        if (v instanceof Array) {
          if (arrayRenderStyle === 'vertical') {
            for (var val of v) {
              html += '<tr class="jsonTable__row"><td colspan="2" class="jsonTable__columnSpacer">&nbsp;</td></tr>';
              walkTheDog(val, replacer);
            }
          } else {
            // horizontal array
            if (v instanceof Array) {
              html += processArray(v, replacer);
              hasArray = true;
            }
          }
        }

        if (typeof v === 'object' && !(v instanceof Array) && !(v == null)) {
          walkTheDog(v, replacer);
          level = subLevel - 1; // Outdent back
        }
      }
    }
  };

  return {
    getTable: getTable
  };
})();

export default JsonToHtml;
