var expect = require('expect.js');
var diff = require('../diff.js');

describe('diff.get()', function () {

  it('should return the diff between two files', function () {
    var result = diff.get('./test/mock-file1', './test/mock-file2');
    expect(result).to.be.an(Array);
    expect(result).to.have.length(7);

    // check diff content
    expect(result[0]).to.be('1 * Some|Another');
    expect(result[1]).to.be('2 - Simple');
    expect(result[2]).to.be('3   Text');
    expect(result[3]).to.be('4   File');
    expect(result[4]).to.be('5 + With');
    expect(result[5]).to.be('6 + Additional');
    expect(result[6]).to.be('7 + Lines');
  });

  it('should return the diff between three files', function () {
    var result = diff.get('./test/mock-file1', './test/mock-file2', './test/mock-file3');
    expect(result).to.be.an(Array);
    console.log(result[1]);
    expect(result).to.have.length(2);
    expect(result[0]).to.be.an(Array);
    expect(result[1]).to.be.an(Array);
    expect(result[0]).to.have.length(7);
    expect(result[1]).to.have.length(7);

    // check diff 1 content
    expect(result[0][0]).to.be('1 * Some|Another');
    expect(result[0][1]).to.be('2 - Simple');
    expect(result[0][2]).to.be('3   Text');
    expect(result[0][3]).to.be('4   File');
    expect(result[0][4]).to.be('5 + With');
    expect(result[0][5]).to.be('6 + Additional');
    expect(result[0][6]).to.be('7 + Lines');

    // check diff 2 content
    expect(result[1][0]).to.be('1   Another');
    expect(result[1][1]).to.be('2 + Extra');
    expect(result[1][2]).to.be('3   Text');
    expect(result[1][3]).to.be('4   File');
    expect(result[1][4]).to.be('5 - With');
    expect(result[1][5]).to.be('6 - Additional');
    expect(result[1][6]).to.be('7 - Lines');

  });

});