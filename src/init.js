import * as yup from 'yup';
import { clearData } from './viev.js';
import onChange from 'on-change';
// import onChange from 'on-change';

const app = () => {
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
  // const watchState = onChange(initialState, render);

  // ControLLer:

  elements.form.addEventListener('submit', (el) => {
    el.preventDefault();
    const formData = new FormData(el.target);

    isValidUrl(formData.get('url'), initialState.posts)
      .then((data) => {
        initialState.posts.push(data);
        clearData(elements);
        elements.formFeedback.classList.add('text-success');
        elements.formFeedback.textContent = 'RSS успешно загружен';
        elements.form.reset();
        elements.input.focus();
      })
      .catch(() => {
        clearData(elements);
        elements.formFeedback.classList.add('text-danger');
        elements.input.classList.add('is-invalid');
        elements.formFeedback.textContent = 'Cсылка должна быть валидным URL';
        elements.form.reset();
        elements.input.focus();
      });
  });
};

export default app;
