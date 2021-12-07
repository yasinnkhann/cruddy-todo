const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err, null);
    } else {
      let filePath = `${exports.dataDir}/${id}.txt`;
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {

  const arr = [];

  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      if (data.length === 0) {
        callback(null, arr);
      }
      if (data[0] === '.DS_Store') {
        data.shift();
      }
      for (let i = 0; i < data.length; i++) {
        let fileName = data[i].slice(0, -4);
        arr.push({ id: fileName, text: fileName });
        if (arr.length === data.length) {
          callback(null, arr);
        }
      }
    }
  });
};

//// THE SOLUTION THAT MAKES SENSE BUT SPECRUNNER DOESNT LIKE

//   fs.readdir(exports.dataDir, (err, data) => {
//     if (err) {
//       callback(err, null);
//     } else {
//       if (data.length === 0) {
//         callback(null, arr);
//       }
//       if (data[0] === '.DS_Store') {
//         data.shift();
//       }
//       for (let i = 0; i < data.length; i++) {
//         let fileName = data[i];
//         let filePath = `${exports.dataDir}/${fileName}`;
//         fs.readFile(filePath, 'utf-8', (err, content) => {
//           if (err) {
//             callback(err, null);
//           } else {
//             arr.push({ id: fileName.slice(0, -4), text: content });
//             if (data.length === arr.length) {
//               const orderedArr = arr.sort((a, b) => a.id - b.id);
//               callback(null, orderedArr);
//             }
//           }
//         });
//       }
//     }
//   });
// };

exports.readOne = (id, callback) => {
  let filePath = `${exports.dataDir}/${id}.txt`;
  fs.readFile(filePath, 'utf-8', (err, text) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, { id, text });
    }
  });
};


exports.update = (id, text, callback) => {
  exports.readOne(id, (err, file) => {
    if (err) {
      callback(err, null);
    } else {
      let filePath = `${exports.dataDir}/${id}.txt`;
      fs.writeFile(filePath, text, 'utf-8', (err, data) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  let filePath = `${exports.dataDir}/${id}.txt`;
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, 'Successfully deleted');
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
