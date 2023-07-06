import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import parseData from './parser.js';
import ru from './locales/ru.js';
import render from './view.js';

const checkValidUrl = (url, urls) => {
  const schema = yup
    .string()
    .required()
    .notOneOf(urls, 'alreadyLoaded')
    .url('invalidUrl');
  return schema.validate(url);
};

const addProxi = (url) => {
  const result = new URL('https://allorigins.hexlet.app/get');
  result.searchParams.set('url', url);
  result.searchParams.set('disableCache', true);

  return result.toString();
};

const getUpdatePosts = (state) => {
  if (state.posts.length === 0) {
    return;
  }
  const urls = state.feeds.map((feed) => feed.url);
  const promises = urls.map((url) => axios
    .get(addProxi(url))
    .then((response) => {
      const data = parseData(response.data.contents);

      const comparator = (arrayValue, otherValue) => arrayValue.title === otherValue.title;
      const addedPosts = _.differenceWith(
        data.items,
        state.posts,
        comparator,
      );
      state.posts = addedPosts.concat(...state.posts);
    })
    .catch((err) => {
      console.error(err);
    }));

  Promise.all(promises).finally(() => setTimeout(() => getUpdatePosts(state), 5000));
};
const elements = {
  form: document.querySelector('.rss-form'),
  input: document.getElementById('url-input'),
  formFeedback: document.querySelector('.feedback'),
  submitButton: document.querySelector('button[type="submit"]'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
  button: document.querySelector('button'),
};

const app = () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const initialState = {
    form: {
      processState: 'filling',
      error: '',
    },

    feeds: [],
    posts: [],

    idCurrentPost: '',
    idVisitedPosts: [],
  };

  // View

  const watchState = onChange(
    initialState,
    render(elements, initialState, i18nInstance),
  );

  // ControLLer:

  elements.form.addEventListener('submit', (el) => {
    el.preventDefault();
    const formData = new FormData(el.target);
    const currentUrl = formData.get('url');

    const urls = initialState.feeds.map((feed) => feed.url);
    checkValidUrl(currentUrl, urls)
      .then((link) => axios.get(addProxi(link)))
      .then((response) => {
        const dataRSS = parseData(response.data.contents);
        dataRSS.feed.id = _.uniqueId();
        dataRSS.feed.url = currentUrl;
        dataRSS.posts.map((post) => {
          const postId = post;
          postId.id = _.uniqueId();
          return postId;
        });
        watchState.form = { processState: 'loading', error: '' };
        watchState.feeds.push(dataRSS.feed);
        watchState.posts.unshift(...dataRSS.posts);
        watchState.form = { processState: 'success', error: '' };
      })

      .catch((err) => {
        watchState.form = { processState: 'failed', error: err.message };

        if (err.name === 'AxiosError') {
          watchState.form = { processState: 'failed', error: 'network' };
        }
      });
  });

  elements.posts.addEventListener('click', ({ target }) => {
    const { id } = target.dataset;
    watchState.idCurrentPost = id;
    if (!watchState.idVisitedPosts.includes(id)) {
      watchState.idVisitedPosts.push(id);
    }
  });
  getUpdatePosts(watchState);
};

export default app;
