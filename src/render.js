import $ from 'jquery';

export const getRenderedList = (rssList, data) => {
  rssList.prepend(`<div id="${data.flowId}" class="col-6">
      <h2 class='title'>${data.title}</h2>
      <p class='description'>${data.description}</p>
      <ul class="list-unstyled list-group">
      ${data.itemsArr.map(({ articleTitle, link, articleDesc }) => `
      <li class="list-group-item mb-2">
        <a href=${link}>${articleTitle}</a>
        </br>
      <button type="button" class="btn btn-primary btn-sm btn-outline-dark" data-whatever="${articleDesc}" data-toggle="modal" data-target="#descriptionModal">
        Описание
      </button>
      </li>`).join('')}
      </ul>
    </div>`);
};

export const getUpdatedList = (id, arr) => {
  $(`#${id}`).find('ul').prepend(`${arr.map(({ articleTitle, link, articleDesc }) => `
      <li class="list-group-item mb-2">
        <a href=${link}>${articleTitle}</a>
        </br>
        <button type="button" class="btn btn-primary btn-sm btn-outline-dark" data-whatever="${articleDesc}" data-toggle="modal" data-target="#descriptionModal">
          Описание
        </button>
      </li>`).join('')}`);
};
