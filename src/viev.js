const clearData = (elements) => {
  const { input, formFeedback } = elements;
  formFeedback.classList.remove('text-danger');
  formFeedback.classList.remove('text-warning');
  formFeedback.classList.remove('text-success');

  input.classList.remove('is-invalid');
};
const handlerFormUrl = (elements, value) => {
  switch (value) {
    case 'sending':
      clearData(elements);
      elements.formFeedback.classList.add('text-success');
      elements.formFeedback.textContent = 'RSS успешно загружен';
      elements.form.reset();
      elements.input.focus();
      break;
    case 'failed':
      clearData(elements);
      elements.formFeedback.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
      elements.formFeedback.textContent = 'Cсылка должна быть валидным URL';
      elements.form.reset();
      elements.input.focus();
      break;
    default:
      break;
  }
};

const render = (elements, initialState) => (path, value) => {
  handlerFormUrl(elements, value);
};

export default render;
