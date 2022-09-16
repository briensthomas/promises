const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const SimpleDb = require('../lib/simple-db.js');

const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

const db = new SimpleDb(TEST_DIR);
const id = crypto.randomBytes(8).toString('hex');

describe('simple database', () => {

  beforeEach(async () => {
    await fs.rm(TEST_DIR, { force: true, recursive: true });
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  it('save a burrito', async () => {    
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

    await fs.writeFile(`${TEST_DIR}/${id}.json`, JSON.stringify(dinner));

    const result = await db.get(id);
    expect(result).toEqual(dinner);
  });

  it('gets all files/objects in the directory', async () => {
    const burritos = [{
      name: 'Eggs, Cheese, and Hash Browns Burrito w/ Hot Sauce'
    },
    {
      name: 'Carne Asada, Cheese, and French Fries Burrito w/ Hot Sauce'
    },
    {
      name: 'Chicken, Rice, Beans, Cheese, Lettuce, Guacamole Burrito w/ Hot Sauce '
    }];
    const burritoPromises = burritos.map((burrito) => {
      return db.save(burrito);
    });
    return Promise.all(burritoPromises)
      .then(savedBurritos => {
        return db.getAll(TEST_DIR)
          .then(retrievedBurritos => {
            expect(savedBurritos).toEqual(expect.arrayContaining(retrievedBurritos));
          });
        
      });

  });
});
