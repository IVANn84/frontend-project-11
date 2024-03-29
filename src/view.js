import onChange from 'on-change';
import renderModal from './renderModal.js';
import renderFeeds from './renderFeeds.js';
import renderPosts from './renderPosts.js';

const clearData = (elements) => {
  const { input, feedback, button } = elements;
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-success');

  input.classList.remove('is-invalid');
  feedback.textContent = '';

  input.disabled = false;
  button.disabled = false;
};

const handlerFormUrl = (elements, value, i18nInstance) => {
  const { feedback, input } = elements;
  const { isValid, error } = value;

  if (!isValid) {
    feedback.textContent = i18nInstance.t(`errors.${error}`);
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
  } else {
    feedback.textContent = '';
    feedback.classList.remove('text-danger');
    input.classList.remove('is-invalid');
  }
};

const handlerProcess = (elements, value, i18nInstance) => {
  const {
    form, feedback, input, button,
  } = elements;
  const { status, error } = value;

  clearData(elements);

  switch (status) {
    case 'loading':
      input.disabled = true;
      button.disabled = true;
      break;
    case 'success':
      feedback.classList.add('text-success');
      feedback.textContent = i18nInstance.t(`status.${status}`);
      form.reset();
      input.focus();
      break;
    case 'failed':
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      feedback.textContent = i18nInstance.t(`errors.${error}`);
      break;
    default:
      break;
  }
};

const watch = (state, elements, i18nInstance) => onChange(state, (path, value) => {
  switch (path) {
    case 'form':
      handlerFormUrl(elements, value, i18nInstance);
      break;
    case 'loadingProcess':
      handlerProcess(elements, value, i18nInstance);
      break;
    case 'feeds':
      renderFeeds(value, elements, i18nInstance);
      break;
    case 'posts':
      renderPosts(state, value, elements, i18nInstance);
      break;
    case 'ui.visitedPosts' || 'ui.id':
      renderModal(state, elements);
      break;
    default:
      break;
  }
});
export default watch;
