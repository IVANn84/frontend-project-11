import onChange from 'on-change';

// const watch = () => {};

const clearData = (elements) => {
  const { input, formFeedback } = elements;
  formFeedback.classList.remove('text-danger');
  formFeedback.classList.remove('text-warning');
  formFeedback.classList.remove('text-success');

  input.classList.remove('is-invalid');
};

export { clearData };
