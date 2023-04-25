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

  const schema = yup.string().url('ссылка должна быть валидной');

  const validate = (field) => schema.validate(field);
  const x = validate('https://ru.hexlons');

  console.log(x);

  // ControLLer:
  // elements.form.addEventListener('submit', (el) => {
  //   el.preventDefault();
  //   const formData = new FormData(el.target);
  //   // console.log(formData.get('url'));
  //   // validate(formData.get('url'));
  // });
};

export default app;
