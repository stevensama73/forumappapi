class LikeCommentRepository {
  /* eslint-disable no-unused-vars */
  async addLike(likeComment) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /* eslint-disable no-unused-vars */
  async updateLike(likeComment) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /* eslint-disable no-unused-vars */
  async verifyAvailibilityLikeComment(threadId, commentId, owner) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /* eslint-disable no-unused-vars */
  async checkIsLikeComment(threadId, commentId, owner) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  /* eslint-disable no-unused-vars */
  async getLikesCommentByThreadId(threadId) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeCommentRepository;
