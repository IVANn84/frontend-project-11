import * as yup from 'yup';
import onChange from 'on-change';

const app = () => {
  const elements = {
    container: document.querySelector('.container-xxl '),
    form: document.querySelector('.rss-form'),
    fields: {
      url: document.getElementById('url-input'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
  };
  // console.log(
  //   elements.container,
  //   elements.form,
  //   elements.fields.url,
  //   elements.submitButton
  // );

  const state = {
    form: {
      state: 'filling',
      error: {},
    },
    posts: [],
  };

  const schema = yup.string().trim().required().url();

  const validate = (field) => schema.validate(field).then((data)=> console.log(data));


  console.log(validate('https://ru.hexlet.io/lessons.rss'));

  // ControLLer:
  elements.form.addEventListener('submit', (el) => {
    el.preventDefault();
    const formData = new FormData(el.target);
    // console.log(formData.get('url'));
    // validate(formData.get('url'));
  });
};

export default app;
