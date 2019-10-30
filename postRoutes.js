
const express = require('express');
// const bodyParser = require('body-parser');
const router = express.Router();

router.use(express.json());

const db =  require('./data/db.js');

router.post('/', (req, res) => {
  let { title, contents, created_at, updated_at  } = req.body;
  created_at = created_at || new Date();
  updated_at = created_at || new Date();

  if (!(title) || !(contents)) {
    res
      .status(400)
      .json({ errorMessage: "Please provide title and content for the post." })
  }

  db.insert({title, contents, created_at, updated_at})
    .then(post => {
      res.status(201).json({success: true, post});
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "There was an error while saving the post to the database" })
    })

});

router.post('/:id/comments', (req, res) => {
  let { text, created_at, updated_at  } = req.body;
  created_at = created_at || new Date();
  updated_at = created_at || new Date();
  const { id } = req.params;
  const comment =  { text, post_id: id, created_at, updated_at  }

  if (!(text)){
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment."})
  }

  db.findById(id)
    .then(post => {
      if (post) {
        db.insertComment(comment)
        res.status(201).json({success: true, comment})
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error while saving comment to the database." })
    })
});


router.get('/', (req, res) => {
  db.find()
    .then(posts => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({error: 'No posts'})
      }

    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The  information could not be retrieved." })
    })

});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(post => {
      if (post && Array.isArray(post) && post.length ) {
        res.status(200).json({success: true, post})
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post information could not be retrieved." })
    })
});


router.get('/:id/comments', (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(post => {
      if (post && Array.isArray(post) && post.length ){
        db.findPostComments(id)
          .then(comments => {
            if (comments && Array.isArray(comments) && comment.length ) {
              res.status(210).json({success: true, comments})
            } else {
              res.status(404).json({message: 'No comments for this post'})
            }
          })
          .catch(error => {
            res.status(500).json({error: "The comments info could not be retrieved"})
          })
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "There post could not be retrieved." })
    })
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed." })
    })
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, contents, created_at, updated_at  } = req.body;

  if (!(title) || !(contents)) {
    res
      .status(400)
      .json({ errorMessage: "Please provide title and contents for the post." })
  }

  db.update(id, { title, contents, created_at, updated_at})
    .then(updated => {
      if (updated) {
        res.status(200).json({success: true, post: updated})
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post information could not be modified." })
    })
});

module.exports = router;
