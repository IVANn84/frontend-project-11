export default (state, elements) => {
  const postId = state.ui.id;
  const currentPost = state.posts.find((post) => post.id === postId);
  const {
    modal, modalTitle, modalBody, modalLink,
  } = elements;
  const {
    id, title, description, link,
  } = currentPost;

  modal.setAttribute('data-id', id);
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalLink.setAttribute('href', link);
};
