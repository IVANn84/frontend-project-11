export default (state, postId, elements) => {
  //  const postId = state.ui.id
  const {
    modal, modalTitle, modalBody, modalLink,
  } = elements;
  const currentPost = state.posts.find((post) => post.id === postId);
  const {
    id, title, description, link,
  } = currentPost;

  // const modal = document.querySelector('.modal');

  // const modalTitle = document.querySelector('.modal-title');
  // const modalBody = document.querySelector('.modal-body');
  // const modalLink = document.querySelector('.modal-link');

  modal.setAttribute('data-id', id);
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalLink.setAttribute('href', link);
};
