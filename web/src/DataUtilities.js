exports.isValidGenre = (genreName) => {
  const invalidGenres = [
    'Audiobook', 'Nonfiction', 'Fiction'
  ];

  return !invalidGenres.find(invalidGenre => genreName === invalidGenre);
}