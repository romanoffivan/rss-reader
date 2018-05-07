import 'bootstrap';
import validator from 'validator';
import axios from 'axios';
import $ from 'jquery';
import './main.scss';
import parse from './parse';
import { getRenderedList, getUpdatedRenderList } from './render';

const form = document.getElementById('rss-form');
const formInput = form.querySelector('.form-input');
const formBtn = form.querySelector('.btn');
const errorMessage = formInput.nextElementSibling;
const rssList = $('.rss-list');
const modal = $('#descriptionModal');
const cors = 'https://cors-anywhere.herokuapp.com/';

const state = {
  address: '',
  addedItems: [],
  formValid: true,
  flowId: 1,
};

const handleInputValidate = () => {
  state.address = `${formInput.value}`;
  const chekAddress = state.address;
  const formValid = validator.isURL(chekAddress);
  if (!formValid) {
    formInput.classList.add('is-invalid');
    formBtn.disabled = true;
    errorMessage.textContent = 'invalid address, please write valid url';
  }
  if (formValid || !chekAddress) {
    formInput.classList.remove('is-invalid');
    formBtn.disabled = false;
    errorMessage.textContent = '';
  }
};

const handleSubmitForm = (event) => {
  event.preventDefault();
  formBtn.disabled = true;
  if (state.addedItems.find(data => data.url === state.address)) {
    state.formValid = false;
    formInput.classList.add('is-invalid');
    return;
  }
  axios.get(`${cors}${state.address}`)
    .then((response) => {
      const { title, description, itemsArr } = parse(response.data);
      const addedRssData = {
        title,
        description,
        itemsArr,
        url: state.address,
        lastPubDate: itemsArr[0].pubDate,
        id: state.flowId,
      };
      state.addedItems = [addedRssData, ...state.addedItems];
      getRenderedList(rssList, state.addedItems[0]);
      formBtn.disabled = false;
      formInput.value = '';
      state.flowId += 1;
      state.formValid = true;
      state.address = '';
    })
    .catch((err) => {
      formInput.classList.add('is-invalid');
      errorMessage.textContent = 'this rss not found';
      throw err;
    });
};

const addNewFeeds = ({ url, lastPubDate, id }) => {
  const lastPubTime = new Date(lastPubDate).getTime();
  axios.get(`${cors}${url}`)
    .then((response) => {
      const { itemsArr } = parse(response.data);
      const newItemsArr = itemsArr.filter(item => new Date(item.pubDate).getTime() > lastPubTime);
      if (newItemsArr.length === 0) {
        return;
      }
      getUpdatedRenderList(id, newItemsArr);
      const itemIndexTimeChange = state.addedItems.length - id;
      state.addedItems[itemIndexTimeChange].lastPubDate = newItemsArr[0].pubDate;
    })
    .catch((err) => {
      formInput.classList.add('is-invalid');
      errorMessage.textContent = 'update error';
      throw err;
    });
};

const updateFeeds = () => {
  Promise.all(state.addedItems.map(addNewFeeds))
    .then(() => setTimeout(updateFeeds, 5000))
    .catch(() => setTimeout(updateFeeds, 10000));
};
updateFeeds();

formInput.addEventListener('input', handleInputValidate);
form.addEventListener('submit', handleSubmitForm);

modal.on('show.bs.modal', (event) => {
  const button = $(event.relatedTarget);
  const recipient = button.data('whatever');
  modal.find('.modal-body').text(recipient);
});
