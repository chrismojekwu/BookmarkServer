const express = require('express')
const logger = require('../logger')
const { bookmarks } = require('../store')

const markRouter = express.Router()
const parser = express.json()


markRouter
    .route('/bookmarks')
    .get((req,res) => {     
        res.json(bookmarks)       
    })
    .post(parser, (req,res) => {
        const { title, url, description, rating} = req.body;
        if (!title) {
    logger.error(`Title is required`);
    return res
      .status(400)
      .send('Invalid data');
        }
        if (!url) {
    logger.error(`Url is required`);
    return res
      .status(400)
      .send('Invalid data');
        }
        if (!description) {
    logger.error(`Description is required`);
    return res
      .status(400)
      .send('Invalid data');
        }
        if (!rating) {
    logger.error(`Rating is required`);
    return res
      .status(400)
      .send('Invalid data');
        }
        const id = Math.floor(Math.random() * 11).toString()
      
        const bookmark = {
    title,
    url,
    description,
    rating,
    id
        }
        bookmarks.push(bookmark)
      
        logger.info(`Bookmark Id:${id} created`);

        res.status(201).location(`http://localhost:8000/bookmarks/${id}`).json(bookmark);
    })

markRouter
    .route('/bookmarks/:id')
    .get((req,res) => {
        const {id} = req.params;
        const bookmark = bookmarks.find(book => book.id === id)

        if (!bookmark) {
          logger.error(`Bookmark w/ ID:${id} not found.`);
          return res
            .status(404)
            .send('Bookmark Not Found');
        }
        res.json(bookmark);
    })
    .delete(parser, (req,res) => {
        const {id} = req.params;
        const bookmarkIndex = bookmarks.findIndex(li => li.id === id )
      
        if(bookmarkIndex === -1){
          logger.error(`Bookmark not found.`);
          return res.status(404).send('Not Found');
        }
        
        bookmarks.splice(bookmarkIndex, 1)
      
        logger.info(`Bookmark deleted.`);
        res.status(204).end();

    })    

module.exports = markRouter    