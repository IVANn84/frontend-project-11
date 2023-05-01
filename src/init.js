import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/ru.js';
import render from './viev.js';

const app = () => {
  const defaultLanguage = 'ru';
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: defaultLanguage,
    resources,
  });
  console.log(i18nInstance.t('form.loader'));

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
      error: {},
    },
    posts: [],
  };

  const isValidUrl = (url, urls) => {
    const schema = yup
      .string()
      .trim()
      .required()
      .notOneOf(urls)
      .url(); /* могут тесты не принять trim() */
    return schema.validate(url);
  };

  // View

  const watchState = onChange(initialState, render(elements, initialState));

  // ControLLer:

  elements.form.addEventListener('submit', (el) => {
    el.preventDefault();
    const formData = new FormData(el.target);

    isValidUrl(formData.get('url'), initialState.posts)
      .then((data) => {
        watchState.form.processState = 'sending';
        watchState.posts.push(data);
      })
      .catch(() => {
        watchState.form.processState = 'failed';
      });
  });
};

export default app;
