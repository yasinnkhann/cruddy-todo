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
  // fs.readdir(exports.dataDir, (err, data) => {
  //   console.log(data);

  // });


  const arr = [];

  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      for (let i = 1; i < data.length; i++) {
        let fileName = data[i];
        let filePath = `${exports.dataDir}/${fileName}`;
        fs.readFile(filePath, (err, content) => {
          if (err) {
            callback(err, null);
          } else {
            arr.push({ id: fileName.substring(0, 5), text: String(content) });
          }
        });
      }
      callback(arr, null);
    }


    // for (let i = 1; i < data.length; i++) {
    //   let fileName = data[i];
    //   let filePath = `${exports.dataDir}/${fileName}`;
    //   fs.readFile(filePath, (err, content) => {
    //     if (err) {
    //       callback(err, null);
    //     } else {
    //       arr.push({ id: fileName.substring(0, 5), text: String(content) });
    //     }
    //   });
    // }


    // if (err) {
    //   callback(err, null);
    // } else {
    //   callback(null, arr);
    // }
  });
  // // fs.promises.readdir(exports.dataDir)
  // //   .then(fileNames => {
  // //     for (let i = 1; i < fileNames.length; i++) {
  // //       let fileName = fileNames[i];
  // //       let filePath = `${exports.dataDir}/${fileName}`;
  // //       fs.promises.readFile(filePath)
  // //         .then((content) => {
  // //           arr.push({ id: fileName.substring(0, 5), text: String(content) });
  // //         });
  // //     }
  // //   })
  // //   .then(() => callback(arr, null));

  // .catch(() => callback(err, null))
  // if (err) {
  //   callback(err, null);
  // } else {
  //   callback(arr, null);
  // }
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
  // [ {id: 0001, text: something}, {id: 0001, text: something}]
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
