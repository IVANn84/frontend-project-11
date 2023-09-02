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

const renderVisitedPosts = (idVisitedPosts) => {
  idVisitedPosts.forEach((id) => {
    const link = document.querySelector(`a[data-id="${id}"]`);
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal', 'link-secondary');
  });
};

const handlerFormUrl = (elements, value, i18nInstance) => {
  const { input, feedback } = elements;
  const { isValid, error } = value;

  clearData(elements);
  if (!isValid) {
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
    feedback.textContent = i18nInstance.t(`errors.${error}`);
  } else {
    feedback.textContent = '';
  }
};

const handlerProcess = (elements, value, i18nInstance) => {
  const { feedback: isFeedback } = elements;
  const { status, error } = value;

  clearData(elements);

  switch (status) {
    case 'loading':
      elements.input.disabled = true;
      elements.button.disabled = true;
      break;
    case 'success':
      elements.feedback.classList.add('text-success');
      isFeedback.textContent = i18nInstance.t(`status.${status}`);
      elements.form.reset();
      elements.input.focus();
      break;
    case 'failed':
      elements.feedback.classList.add('text-danger');
      elements.input.classList.add('is-invalid');

      isFeedback.textContent = i18nInstance.t(`errors.${error}`);
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
    case 'ui.visitedPosts':
      renderVisitedPosts(value);
      break;
    case 'ui.id':
      renderModal(state, value);
      break;
    default:
      break;
  }
});
export default watch;
