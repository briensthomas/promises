const fs = require('fs/promises');
const path = require('path');
import { nanoid } from 'nanoid';

const nanoId = nanoid();

class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }
  
  get(id) {
    this.filePath = path.join(this.dirPath, `${id}.json`);
    fs.readFile(this.filePath)
      .then(JSON.parse)
      .catch (err => {
        if (err.code === 'ENOENT') {
          throw new Error (`bad file: ${this.filePath}`);
        }
        throw err;
      });
    return fs.readFile(this.filePath);
  }
  
  save({ obj }) {
    obj.id = nanoId;
    const data = JSON.stringify(obj);
    fs.writeFile(`[${obj.id}].json`, data, (err) => {
      if (err) throw err;
    });
  }
  
}

module.exports = SimpleDb;
