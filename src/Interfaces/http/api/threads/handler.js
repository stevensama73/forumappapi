const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const StructureThreadWithCommentsAndRepliesAndLikesCommentUseCase = require('../../../../Applications/use_case/StructureThreadWithCommentsAndRepliesAndLikesCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { username } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(username, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getDetailThreadHandler(request, h) {
    const structureThreadWithCommentsAndRepliesAndLikesCommentUseCase = this._container.getInstance(StructureThreadWithCommentsAndRepliesAndLikesCommentUseCase.name);
    const data = await structureThreadWithCommentsAndRepliesAndLikesCommentUseCase.execute(request.params);
    const response = h.response({
      status: 'success',
      data,
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
