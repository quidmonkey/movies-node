const { createMovie, getMovieModel } = require('./test-utils');
const { RequestError } = require('./utils');

require('./create');

it('/create - should create a movie', async () => {
  const movieModel = getMovieModel();
  const { movie } = await createMovie(movieModel);

  const expected = Object.keys(movieModel).concat('id', 'createdAt', 'updatedAt').sort();
  const actual = Object.keys(movie).sort();

  expect(actual).toEqual(expected);
});

it('/create - should fail on a bad movie model', async () => {
  try {
    await createMovie({
      title: 'foobarbaz'
    });
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Validation Failed - Incorrect Movie Data Model.');
  }
});

it('/create - should fail on an incorrect DynamoDb call', async () => {
  process.env.DYNAMODB_MOVIES_TABLE = 'foobar';
  
  const movieModel = getMovieModel();
  
  try {
    await createMovie(movieModel);
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(501);
    expect(err.message).toBe('Couldn\'t create the movie.');
  }
});