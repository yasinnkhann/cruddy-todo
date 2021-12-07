const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      console.log('readCounter + fileData: ' + fileData);
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      console.log('writeCounter + counterString' + counterString);
      callback(null, counterString);
      // fix this callback somehow?
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  readCounter((err, data) => {
    if (err) {
      callback(err, null);
    } else {
      writeCounter(data + 1, (err, writeData) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, writeData);
        }
      });
    }
  });
};

// getNextUniqueId - takes current counter, increments it
// invoke writeCounter? update the counter.txt files with the updated local var counter
// invoke readCounter? to return the updated counter.txt
// need for callbacks? maybe a console.log for success?

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
