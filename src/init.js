import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import parseData from './parser.js';
import ru from './locales/ru.js';
import render from './view.js';

const addProxi = (url) => {
  const result = new URL('/get', 'https://allorigins.hexlet.app');
  result.searchParams.set('url', url);
  result.searchParams.set('disableCache', true);

  return result.toString();
};
const getError = (err) => {
  const maping = {
    AxiosError: 'network',
    invalidRSS: 'invalidRSS',
    unableToParseData: 'unableToParseData',
  };
  const result = maping[err.name];
  console.log(result);
  return result;
};
const fetchRss = (url, state) => {
  state.loadingProcess = { status: 'loading', error: '' };
  axios
    .get(addProxi(url))
    .then((response) => {
      const dataRSS = parseData(response.data.contents);
      dataRSS.feed.id = _.uniqueId();
      dataRSS.feed.url = url;
      dataRSS.posts.map((post) => {
        const postId = post;
        postId.id = _.uniqueId();
        return postId;
      });
      state.feeds.push(dataRSS.feed);
      state.posts.unshift(...dataRSS.posts);
      state.loadingProcess = { status: 'success', error: '' };
    })

    .catch((error) => {
      state.loadingProcess = {
        status: 'failed',
        error: getError(error),
      };
    });
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

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    formFeedback: document.querySelector('.feedback'),
    submitButton: document.querySelector('button[type="submit"]'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    button: document.querySelector('button'),
  };
  const initialState = {
    form: {
      processState: 'filling',
      error: '',
    },
    loadingProcess: {
      status: 'idle',
      error: '',
    },

    feeds: [],
    posts: [],

    ui: { id: null, visitedPosts: new Set() },
  };

  const i18nInstance = i18next.createInstance();
  i18nInstance
    .init({
      lng: 'ru',
      debug: true,
      resources: {
        ru,
      },
    })
    .then(() => {
      const validateUrl = (url, urls) => {
        const schema = yup
          .string()
          .required()
          .notOneOf(urls, 'alreadyLoaded')
          .url('invalidUrl');
        return schema
          .validate(url)
          .then(() => null)
          .catch((error) => error);
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
        validateUrl(currentUrl, urls).then((error) => {
          if (error) {
            watchState.form = { processState: 'failed', error: error.message };
            return;
          }
          fetchRss(currentUrl, watchState);
        });
      });

      elements.posts.addEventListener('click', ({ target }) => {
        const { id } = target.dataset;
        watchState.ui.id = id;
        watchState.ui.visitedPosts.add(id);
      });
      getUpdatePosts(watchState);
    });
};

export default app;
