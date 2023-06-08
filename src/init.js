import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import parseData from './parser.js';
import ru from './locales/ru.js';
import render from './viev.js';

const isValidUrl = (url, urls) => {
  const schema = yup
    .string()
    .trim()
    .required()
    .notOneOf(urls, 'alreadyLoaded')
    .url('invalidUrl');
  return schema.validate(url);
};

const getUrlThroughProxi = (url) => {
  const result = new URL('https://allorigins.hexlet.app/get');
  result.searchParams.set('url', url);
  result.searchParams.set('disableCache', true);

  return result;
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

  const elements = {
    container: document.querySelector('.container-xxl '),
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    formFeedback: document.querySelector('.feedback'),
    submitButton: document.querySelector('button[type="submit"]'),
  };

  const initialState = {
    form: {
      processState: 'filling',
      error: '',
    },
    feeds: [],
    posts: [],
  };

  // View

  const watchState = onChange(
    initialState,
    render(elements, initialState, i18nInstance)
  );

  // ControLLer:

  elements.form.addEventListener('submit', (el) => {
    el.preventDefault();
    const formData = new FormData(el.target);
    const currentUrl = formData.get('url');

    const urls = initialState.feeds.map((feed) => feed.url);
    isValidUrl(currentUrl, urls)
      .then((link) => axios.get(getUrlThroughProxi(link)))
      .then((response) => {
        const dataRSS = parseData(response.data.contents);
        dataRSS.feed.id = _.uniqueId();
        dataRSS.feed.url = currentUrl;
        console.log(dataRSS);
        dataRSS.posts.map((post) => {
          const postId = post;
          postId.id = _.uniqueId();
          return postId;
        });
        watchState.feeds.push(dataRSS.feed);
        watchState.posts.unshift(...dataRSS.posts);
        watchState.form.processState = 'loading';
      })

      .catch((err) => {
        watchState.form.error = err.message;
        // console.log(err.message);

        if (err.name === 'AxiosError') {
          watchState.form.error = 'network';
          watchState.form.processState = 'failed';
          console.log(initialState.form.error);
          return;
        }
        watchState.form.processState = 'failed';
      });
  });
};
export default app;
