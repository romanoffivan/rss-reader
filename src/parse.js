export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const channel = doc.querySelector('channel');

  const title = channel.querySelector('title').innerHTML;
  const description = channel.querySelector('description').innerHTML;

  const itemsArr = [];
  const items = channel.querySelectorAll('item');
  items.forEach(val => itemsArr.push({
    articleTitle: val.querySelector('title').innerHTML,
    link: val.querySelector('link').innerHTML,
    articleDesc: val.querySelector('description').innerHTML,
    pubDate: val.querySelector('pubDate').innerHTML,
  }));

  return { title, description, itemsArr };
};
