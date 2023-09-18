const AddedThread = require('../AddedThread');
 
describe('a AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'title-xxx',
      body: 'body-xxx',
      date: '2021-08-08T07:59:18.982Z',
      owner: 'owner-xxx',
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
 
  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'thread-123',
      title: 'title-xxx',
      body: 'body-xxx',
      date: 'date-xxx',
      owner: 'owner-xxx',
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
 
  it('should create addedThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'title-xxx',
      body: 'body-xxx',
      date: '2021-08-08T07:59:18.982Z',
      owner: 'owner-xxx',
    };

    const { id, title, body, date, owner } = new AddedThread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(owner).toEqual(payload.owner);
  });
});