import renderModal from './renderModal.js';
import renderFeeds from './renderFeeds.js';
import renderPosts from './renderPosts.js';

const clearData = (elements) => {
  const { input, formFeedback } = elements;
  formFeedback.classList.remove('text-danger');
  formFeedback.classList.remove('text-success');

  input.classList.remove('is-invalid');
};

const renderVisitedPosts = (idVisitedPosts) => {
  idVisitedPosts.forEach((id) => {
    const link = document.querySelector(`a[data-id="${id}"]`);
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal', 'link-secondary');
  });
};

const handlerFormUrl = (elements, value, i18nInstance, initialState) => {
  const { formFeedback: isFeedback } = elements;
  const { processState: step } = value;

  clearData(elements);
  switch (step) {
    case 'success':
      elements.formFeedback.classList.add('text-success');
      isFeedback.textContent = i18nInstance.t(`status.${step}`);
      elements.form.reset();
      elements.input.focus();
      break;
    case 'failed':
      elements.formFeedback.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
      isFeedback.textContent = i18nInstance.t(
        `errors.${[initialState.form.error]}`,
      );
      elements.form.reset();
      elements.input.focus();
      break;
    default:
      break;
  }
};

const render = (elements, initialState, i18nInstance) => (path, value) => {
  switch (path) {
    case 'form':
      handlerFormUrl(elements, value, i18nInstance, initialState);
      break;
    case 'feeds':
      renderFeeds(value, elements, i18nInstance);
      break;
    case 'posts':
      renderPosts(initialState, value, elements, i18nInstance);
      break;
    case 'idVisitedPosts':
      renderVisitedPosts(value);
      break;
    case 'idCurrentPost':
      renderModal(initialState, value);
      break;
    default:
      break;
  }
};

export default render;
