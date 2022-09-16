const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
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
    const rando = {
      name: 'Kashi',
      food: 'Burritos'
    };

    const db = new SimpleDb(TEST_DIR);

    await db.save(rando);

    const result = await db.get(rando.id);

    expect(result).toEqual(rando);
  });

  it('gets file by id', async () => {
    const dinner = {
      name: 'burrito',
    };
    const id = crypto.randomBytes(8).toString('hex');
    await fs.writeFile(`${TEST_DIR}/${id}.json`, JSON.stringify(dinner));
    const db = new SimpleDb(TEST_DIR);
    const result = await db.get(id);
    expect(result).toEqual(dinner);
  });

});
