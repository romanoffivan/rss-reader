export default (rssList, data) => {
  rssList.prepend(`<div class="col-6">
      <h2 class='title'>${data.title}</h2>
      <p class='description'>${data.description}</p>
      <ul class="list-unstyled list-group">
      ${data.itemsArr.map(({ articleTitle, link }) => `
      <li class="list-group-item mb-2">
        <a href=${link}>${articleTitle}</a>
      </li>`).join('')}
      </ul>
    </div>`);
};
