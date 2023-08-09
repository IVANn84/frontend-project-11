import renderModal from './renderModal.js';
import renderFeeds from './renderFeeds.js';
import renderPosts from './renderPosts.js';

const clearData = (elements) => {
  const { input, formFeedback, button } = elements;
  formFeedback.classList.remove('text-danger');
  formFeedback.classList.remove('text-success');

  input.classList.remove('is-invalid');
  formFeedback.textContent = '';

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
  const { formFeedback: isFeedback } = elements;
  const { isValid, error } = value;

  clearData(elements);
  switch (isValid) {
    case false:
      elements.formFeedback.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
      isFeedback.textContent = i18nInstance.t(`errors.${[error]}`);
      break;
    default:
      break;
  }
};
const handlerProcess = (elements, value, i18nInstance, initialState) => {
  const { formFeedback: isFeedback } = elements;
  const { status: process } = value;
  console.log(value);

  clearData(elements);

  switch (process) {
    case 'loading':
      elements.input.disabled = true;
      elements.button.disabled = true;
      break;
    case 'success':
      elements.formFeedback.classList.add('text-success');
      isFeedback.textContent = i18nInstance.t('success');
      elements.form.reset();
      elements.input.focus();
      break;
    case 'failed':
      elements.formFeedback.classList.add('text-danger');
      elements.input.classList.add('is-invalid');

      isFeedback.textContent = i18nInstance.t(
        initialState.loadingProcess.error,
      );
      break;
    default:
      break;
  }
};

const render = (elements, initialState, i18nInstance) => (path, value) => {
  switch (path) {
    case 'form':
      handlerFormUrl(elements, value, i18nInstance);
      break;
    case 'loadingProcess':
      handlerProcess(elements, value, i18nInstance, initialState);
      break;
    case 'feeds':
      renderFeeds(value, elements, i18nInstance);
      break;
    case 'posts':
      renderPosts(initialState, value, elements, i18nInstance);
      break;
    case 'ui.visitedPosts':
      renderVisitedPosts(value);
      break;
    case 'ui.id':
      renderModal(initialState, value);
      break;
    default:
      break;
  }
};

export default render;
