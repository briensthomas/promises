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
    return fs.writeFile(`${this.dirPath}/${obj.id}.json`, data);
  }
  
  getAll() {
    
  }
}

module.exports = SimpleDb;
