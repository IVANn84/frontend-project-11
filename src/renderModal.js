export default (state, elements) => {
  const displayedPostId = state.ui.id;
  const currentPost = state.posts.find((post) => post.id === displayedPostId);
  const { title, description, link } = currentPost;
  const { modalTitle, modalBody, modalLink } = elements;

  if (modalTitle) {
    const titleElement = document.createElement('h5');
    titleElement.textContent = title;
    modalTitle.innerHTML = '';
    modalTitle.appendChild(titleElement);
  }

  modalBody.textContent = description;
  modalLink.setAttribute('href', link);
};
