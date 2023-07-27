const parseData = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    const error = new Error();
    error.name = 'invalidRSS';

    throw error;
  }
  try {
    const feed = {
      title: doc.querySelector('title').textContent,
      description: doc.querySelector('description').textContent,
    };

    const posts = Array.from(doc.querySelectorAll('item')).map((post) => {
      const title = post.querySelector('title').textContent;
      const description = post.querySelector('description').textContent;
      const link = post.querySelector('link').textContent;
      return { title, description, link };
    });
    return { feed, posts };
  } catch (error) {
    error.name = 'unableToParseData';
    throw error;
  }
};

export default parseData;
