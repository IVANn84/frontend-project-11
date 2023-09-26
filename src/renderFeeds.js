export default (feedsList, elements, i18next) => {
  const div = document.createElement('div');
  div.classList.add('list-group', 'border-0', 'rounded-0');
  feedsList.forEach((feed) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'border-0', 'border-end-0');

    const header = document.createElement('h3');
    header.classList.add('h6', 'm-0');
    header.textContent = feed.title;

    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50');
    description.textContent = feed.description;

    liEl.prepend(description);
    liEl.prepend(header);

    div.prepend(liEl);
  });

  const title = document.createElement('h2');

  title.classList.add('card-title', 'h4');
  title.textContent = i18next.t('renderFeeds.header');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.prepend(title);

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  card.prepend(cardBody);
  card.append(div);

  const { feeds } = elements;
  feeds.replaceChildren(card);
};
