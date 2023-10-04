const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: userId } = request.auth.credentials
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(userId, request.payload);

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
    const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);
    const data = await getDetailThreadUseCase.execute(request.params)
    const response = h.response({
      status: 'success',
      data: {
        thread: {
          id: data[0].thread_id,
          title: data[0].title,
          body: data[0].body,
          date: data[0].thread_date,
          username: data[0].thread_username,
          comments: data.map((comment) => ({
            id: comment.comment_id,
            username: comment.comment_username,
            date: comment.comment_date,
            content: comment.is_delete ? "**komentar telah dihapus**" : comment.content
          }))
        }
      }
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
