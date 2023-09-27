export default (state, postId, elements) => {
  const currentPost = state.posts.find((post) => post.id === postId);
  const {
    title, description, link,
  } = currentPost;
  const {
    modalTitle, modalBody, modalLink,
  } = elements;

  // const modal = document.querySelector('.modal');

  // const modalTitle = document.querySelector('.modal-title');
  // const modalBody = document.querySelector('.modal-body');
  // const modalLink = document.querySelector('.modal-link');

  // modal.setAttribute('data-id', id);
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalLink.setAttribute('href', link);
};
