import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import parseData from './parser.js';
import ru from './locales/ru.js';
import render from './viev.js';

const isValidUrl = (url, urls) => {
  const schema = yup
    .string()
    .trim()
    .required()
    .notOneOf(urls, 'RSS уже существует')
    .url('ресурс не содержит валидный RSS'); /* могут тесты не принять trim() */
  return schema.validate(url);
};

const getUrlThroughProxi = (url) =>
  `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;

const getDataRss = (document) => {
  const title = document.querySelector('title').textContent;
  const descriotion = document.querySelector('description').textContent;
  const item = document.querySelectorAll('item');
  const items = Array.from(item).map((el) => el.textContent.split('/n'));
  console.log(items);
  return { title, descriotion, items };
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
      error: null,
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

    isValidUrl(formData.get('url'), initialState.feeds)
      .then((link) => axios.get(getUrlThroughProxi(link)))
      .then((response) => {
        watchState.form.processState = 'loading';
        const result = parseData(response.data.contents);
        const dataRSS = getDataRss(result);
        console.log(dataRSS);

        // watchState.feeds.push(link);
      })

      .catch((err) => {
        console.log(err.message);
        watchState.form.processState = 'failed';
      });
  });
};

export default app;
