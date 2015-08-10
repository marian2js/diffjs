var fs = require('fs');
var path = require('path');

var diff = {

  /**
   * Returns an Array with the diff between two files
   * If it receives more than two files, it will return an Array of Arrays with the diff between each file and its next one.
   *
   * @returns {Array}
   */
  get: function () {
    var files = [];
    var results = [];
    var file;
    for (var i = 0; i < arguments.length; i++) {
      file = fs.readFileSync(path.join(__dirname, arguments[i]), 'utf8');
      files[i] = file.split('\n')
    }
    for (var e = 0; e < files.length - 1; e++) {
      results.push(diff._compareArrays(files[e], files[e + 1]));
    }
    if (results.length === 1) {
      return results[0];
    }
    return results;
  },

  /**
   * Returns an array with the diff between two arrays
   *
   * @param {Array} arr1
   * @param {Array} arr2
   * @param {number} [line]
   * @returns {Array}
   * @private
   */
  _compareArrays: function (arr1, arr2, line) {
    var match = diff._longSequenceMatch(arr1, arr2);
    var prevArr1 = [];
    var prevArr2 = [];
    var matchArr1 = [];
    var matchArr2 = [];
    var endArr1 = [];
    var endArr2 = [];
    var result;
    line = line || 0;
    if (match.size) {
      prevArr1 = arr1.slice(0, match.arr1);
      matchArr1 = arr1.slice(match.arr1, match.arr1 + match.size);
      endArr1 = arr1.slice(match.arr1 + match.size, match.arr1.length);
      prevArr2 = arr2.slice(0, match.arr2);
      matchArr2 = arr2.slice(match.arr2, match.arr2 + match.size);
      endArr2 = arr2.slice(match.arr2 + match.size, match.arr2.length);
      result = diff._compareArrays(prevArr1, prevArr2, line);
      result = result.concat(diff._getDiff(matchArr1, matchArr2, line + result.length));
      result = result.concat(diff._compareArrays(endArr1, endArr2, line + result.length));
      return result;
    }
    return diff._getDiff(arr1, arr2, line);
  },

  /**
   * Returns the diff between two arrays where every line is equal or every line is different
   *
   * @param {Array} arr1
   * @param {Array} arr2
   * @param {number} line
   * @returns {Array}
   * @private
   */
  _getDiff: function (arr1, arr2, line) {
    var shorterArr;
    var longestArr;
    var symbol;
    if (arr1.length > arr2.length) {
      longestArr = arr1;
      shorterArr = arr2;
      symbol = '-';
    } else {
      shorterArr = arr1;
      longestArr = arr2;
      symbol = '+';
    }
    var diff = [];
    for (var i = 0; i < shorterArr.length; i++) {
      line++;
      if (arr1[i] === arr2[i]) {
        diff[i] = line + '   ' + arr1[i];
      } else {
        diff[i] = line + ' * ' + arr1[i] + '|' + arr2[i];
      }
    }
    for (var e = i; e < longestArr.length; e++) {
      line++;
      diff[e] = line + ' ' + symbol + ' ' + longestArr[e];
    }
    return diff;
  },

  /**
   * Returns an object with information about the longest sequence of matches between two arrays
   *
   * @param {Array} arr1
   * @param {Array} arr2
   * @private
   */
  _longSequenceMatch: function (arr1, arr2) {
    var match = {
      size: 0
    };
    var posArr1;
    var posArr2;
    var length = 0;
    for (var i = 0; i < arr2.length; i++) {
      for (var e = 0; e < arr1.length; e++) {
        if (arr1[e] === arr2[i]) {
          length++;

          // store the position in which start the sequence
          if (length === 1) {
            posArr1 = e;
            posArr2 = i;
          }

          if (length > match.size) {
            match.size = length;
            match.arr1 = posArr1;
            match.arr2 = posArr2;
          }
          i++;
        } else {
          length = 0;
        }
      }
      if (i === arr2.length) {
        break;
      }
    }
    return match;
  }

};

module.exports = diff;