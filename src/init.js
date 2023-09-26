import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import parseData from './parser.js';
import resources from './locales/index.js';
import watch from './view.js';

const TIMEOUT = 10000;
const UPDATE_TIME = 5000;

const addProxy = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.set('url', url);
  proxyUrl.searchParams.set('disableCache', true);

  return proxyUrl.toString();
};

const getError = (error) => {
  const maping = {
    AxiosError: 'network',
    ParserError: 'invalidRSS',
  };

  return maping[error.name] || 'unknown';
};

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

const fetchRss = (url, state) => {
  state.loadingProcess = { status: 'loading', error: '' };
  axios
    .get(addProxy(url), { timeout: TIMEOUT })
    .then((response) => {
      const dataRSS = parseData(response.data.contents);
      dataRSS.feed.id = _.uniqueId();
      dataRSS.feed.url = url;
      dataRSS.posts.forEach((post) => {
        post.channelId = dataRSS.feed.id;
        post.id = _.uniqueId();
      });
      state.feeds.push(dataRSS.feed);
      state.posts.unshift(...dataRSS.posts);
      console.log(state);
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
  const promises = state.feeds.map(({ url, id }) => axios
    .get(addProxy(url), { timeout: TIMEOUT })
    .then((response) => {
      const oldPosts = state.posts;
      const { posts: newPosts } = parseData(response.data.contents);
      const posts = _.differenceBy(newPosts, oldPosts, 'link').map(
        (post) => ({
          ...post,
          channelId: id,
          id: _.uniqueId(),
        }),
      );

      state.posts = posts.concat(...state.posts);
    })
    .catch((error) => {
      console.error(error);
    }));

  Promise.all(promises).finally(() => setTimeout(() => getUpdatePosts(state), UPDATE_TIME));
};

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    feedback: document.querySelector('.feedback'),
    submit: document.querySelector('button[type="submit"]'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    button: document.querySelector('.rss-form button[type="submit"]'),
    modal: document.querySelector('.modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.modal-link'),

  };

  const initialState = {
    form: {
      isValid: true,
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
      resources,
    })
    .then(() => {
      const watchedState = watch(initialState, elements, i18nInstance);

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const currentUrl = formData.get('url');

        const urls = initialState.feeds.map((feed) => feed.url);
        validateUrl(currentUrl, urls).then((error) => {
          if (error) {
            watchedState.form = {
              isValid: false,
              error: error.message,
            };
            return;
          }
          watchedState.form = { isValid: true, error: '' };
          fetchRss(currentUrl, watchedState);
        });
      });

      elements.posts.addEventListener('click', ({ target }) => {
        if (target.dataset.id) {
          const { id } = target.dataset;
          watchedState.ui.id = id;
          watchedState.ui.visitedPosts.add(id);
        }
      });
      getUpdatePosts(watchedState);
    });
};

export default app;
