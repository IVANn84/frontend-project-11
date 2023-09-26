export default (state, elements, i18next) => {
  elements.containerFeeds.innerHTML = '';
  const divContainer = document.createElement('div');
  const divTitle = document.createElement('div');
  const ul = document.createElement('ul');
  const h2 = document.createElement('h2');

  h2.classList.add('card-title', 'h4');
  h2.textContent = i18next.t('renderFeeds.header');
  divContainer.classList.add('card', 'border-0');
  divTitle.classList.add('card-body');
  divTitle.append(h2);
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  divContainer.append(divTitle, ul);
  elements.containerFeeds.append(divContainer);

  state.feeds.forEach((feed) => {
    const li = document.createElement('li');
    const p = document.createElement('p');
    const h3 = document.createElement('h3');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    h3.classList.add('h6', 'm-0');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    li.prepend(p);
    li.prepend(h3);
    h3.textContent = feed.title;
    ul.prepend(li);
  });
};
