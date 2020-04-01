/* eslint-disable strict */
const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');



describe('shopping list service', () => {
  let db;
  let testItems = [
    {
      id: 1,
      name: 'test item',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      price: '$10.00',
      category: 'main'
    },
    {
      id: 2,
      name: 'test item 2',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      price: '$5.00',
      category: 'main'
    },
    {
      id: 3,
      name: 'test item',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      price: '$20.00',
      category: 'main'
    }
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => db('shopping_list').truncate());

  afterEach(() => db('shopping_list').truncate());

  after(() => db.destroy());

  context('shopping list has data!', () => {
    beforeEach(() => {
      return db.into('shopping_list')
        .insert(testItems);
    });
    it('getAllItems resolves items in shopping_list', () => {
      const expected = testItems.map(item => ({
        ...item,
        checked: false,
      }));
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(expected);
        });
    });
    it('getById resolves individual item by id keys value', () => {
      const getId = 3;
      const item3 = testItems[getId - 1];
      return ShoppingListService.getById(db, getId)
        .then(actual => {
          expect(actual).to.eql({
            id: getId,
            name: item3.name,
            date_added: item3.date_added,
            price: item3.price,
            category: item3.category,
            checked: false
          });
        });
    });
    it('insertItem inserts an item by id', () => {
      const newItem = {
        name: 'some food',
        price: '3.50',
        date_added: Date.now(),
        category: 'breakfast',
        checked: true
      };
      return ShoppingListService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newItem.name,
            price: newItem.price,
            category: newItem.category,
            checked: newItem.checked
          });
        });
    });
  });

});