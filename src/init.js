import * as yup from 'yup';
import onChange from 'on-change';

const app = () => {
  const elements = {
    container: document.querySelector('.container-xxl '),
    form: document.querySelector('.rss-form'),
    field: document.getElementById('url-input'),
    formFeedback: document.querySelector('.feedback'),
    submitButton: document.querySelector('button[type="submit"]'),
  };
  // console.log(
  //   // elements.container,
  //   // elements.form,
  //   // elements.fields.url,
  //   // elements.submitButton,
  //   elements.formFeedback
  // );

  const state = {
    form: {
      processState: 'filling',
      error: {},
    },
    posts: [],
  };

  const validate = (url, urls) => {
    const schema = yup
      .string()
      .trim()
      .required()
      .notOneOf(urls)
      .url(); /* могут тесты не принять trim() */
    return schema.validate(url);
  };

  // ControLLer:

  elements.form.addEventListener('submit', (el) => {
    el.preventDefault();
    const formData = new FormData(el.target);

    validate(formData.get('url'), state.posts)
      .then((data) => {
        state.posts.push(data);
        elements.formFeedback.classList.remove('text-danger');
        elements.formFeedback.classList.add('text-success');
        elements.formFeedback.textContent = 'RSS успешно загружен';
        console.log(state.posts);
        elements.form.reset();
        elements.field.focus();
      })
      .catch(() => {
        elements.field.classList.add('is-invalid');
        elements.formFeedback.textContent = 'Cсылка должна быть валидным URL';
        elements.form.reset();
        elements.field.focus();
      });
  });
};

export default app;
