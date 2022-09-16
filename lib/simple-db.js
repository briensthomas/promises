/* eslint-disable no-console */
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }
  
  async get(id) {
    this.filePath = path.join(this.dirPath, `${id}.json`);
    try {
      const text = await fs.readFile(this.filePath);
      return JSON.parse(text);
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`bad file: ${this.filePath}`);
      }
      throw err;
    }
  }
  
  save(obj) {
    obj.id = crypto.randomBytes(4).toString('hex');
    const data = JSON.stringify(obj);
    return fs.writeFile(`${this.dirPath}/${obj.id}.json`, data)
      .then(() => obj);
  }
  
  getAll() {
    return fs.readdir(this.dirPath)
      .then(paths => {
        const promises = paths.map(path => { 
          return fs.lstat(`${this.dirPath}/${path}`)
            .then(stat => {
              if(stat.isDirectory()) {
                return '';
              } else {
                return fs.readFile(`${this.dirPath}/${path}`)
                  .then((fileData) => JSON.parse(fileData.toString()));
              }
            });
        });
        return Promise.all(promises)
          .then(fileDatas => {
            fileDatas.forEach((fileData) => {
              console.log(fileData);
            });
            return fileDatas;
          });
      });
  }
}

module.exports = SimpleDb;
