/* eslint-disable no-console */
'use strict';
/*globakl knex*/

require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

function searchByName(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.info('Search Term working', { searchTerm });
      console.info(result);
    });
}

searchByName('Not dogs');

function paginateItems(page) {
  const pageLimit = 6;
  const offset = pageLimit * (page - 1);
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(pageLimit)
    .offset(offset)
    .then(result => {
      console.info('Paginate Items working', { page });
      console.info(result);
    });
}

paginateItems(2);

function productsAddedDaysAgo(daysAgo) {
  knexInstance
    .select('id', 'name', 'price', 'date_added', 'checked', 'category')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw('now() - \'?? days\':: INTERVAL', daysAgo)
    )
    .then(results => {
      console.info('products added days ago working');
      console.log(results);
    });
}

productsAddedDaysAgo(12);

function categoryCosts() {
  knexInstance
    .select('category')
    .count('name AS items')
    .sum('price as total')
    .select(knexInstance.raw('ROUND(AVG(price), 2) AS average'))
    .from('shopping_list')
    .groupBy('category')
    .then(result => console.info(result));
}

categoryCosts();