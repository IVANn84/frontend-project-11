export default (initialState, postId) => {
  const currentPost = initialState.posts.find((post) => post.id === postId);
  console.log(currentPost);

  const {
    id, title, description, link,
  } = currentPost;

  const modal = document.querySelector('.modal');
  console.log(modal);
  
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const modalLink = document.querySelector('.modal-link');

  modal.setAttribute('data-id', id);
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalLink.setAttribute('href', link);
};
