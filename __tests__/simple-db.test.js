const fs = require('fs/promises');
const path = require('path');
const SimpleDb = require('../lib/simple-db.js');

const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

describe('simple database', () => {

  beforeEach(async () => {
    await fs.rm(TEST_DIR, { force: true, recursive: true });
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  it('copy a file?', async () => {    
    const srcPath = path.join(TEST_DIR, 'file.txt');
    const destPath = path.join(TEST_DIR, 'copy.txt');

    const db = new SimpleDb(TEST_DIR);
    
    db.save('file.txt', srcPath);

    fs.writeFile(srcPath, 'copy me');

    db.get(srcPath);

    const res = await fs.readFile(destPath, 'utf-8');
    expect(res).toEqual('copy me');
  });

});
