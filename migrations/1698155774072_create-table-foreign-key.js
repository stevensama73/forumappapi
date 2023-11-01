/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint('likes_comment', 'fk_likes_comment.owner', 'FOREIGN KEY(owner) REFERENCES users(username) ON DELETE CASCADE');
  pgm.addConstraint('likes_comment', 'fk_likes_comment.thread_id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
  pgm.addConstraint('likes_comment', 'fk_likes_comment.comment_id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
  pgm.addConstraint('threads', 'fk_threads.owner', 'FOREIGN KEY(owner) REFERENCES users(username) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.owner', 'FOREIGN KEY(owner) REFERENCES users(username) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.thread_id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
  pgm.addConstraint('replies', 'fk_replies.owner', 'FOREIGN KEY(owner) REFERENCES users(username) ON DELETE CASCADE');
  pgm.addConstraint('replies', 'fk_replies.comment_id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.addConstraint('likes_comment', 'fk_likes_comment.owner', 'FOREIGN KEY(owner) REFERENCES users(username) ON DELETE CASCADE');
  pgm.addConstraint('likes_comment', 'fk_likes_comment.thread_id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
  pgm.addConstraint('likes_comment', 'fk_likes_comment.comment_id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
  pgm.addConstraint('threads', 'fk_threads.owner', 'FOREIGN KEY(owner) REFERENCES users(username) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.owner', 'FOREIGN KEY(owner) REFERENCES users(username) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.thread_id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
  pgm.addConstraint('replies', 'fk_replies.owner', 'FOREIGN KEY(owner) REFERENCES users(username) ON DELETE CASCADE');
  pgm.addConstraint('replies', 'fk_replies.comment_id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};