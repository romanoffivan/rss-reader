import 'bootstrap';
import validator from 'validator';
import axios from 'axios';
import $ from 'jquery';
import './main.scss';
import parse from './parse';
import { getRenderedList, getUpdatedList } from './render';

const form = document.getElementById('rss-form');
const formInput = form.querySelector('.form-input');
const formBtn = form.querySelector('.btn');
const errorMessage = formInput.nextElementSibling;
const rssList = $('.rss-list');
const modal = $('#descriptionModal');
const cors = 'https://cors-anywhere.herokuapp.com/';

const state = {
  address: '',
  addedFlow: [],
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
  if (state.addedFlow.find(data => data.url === state.address)) {
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
      state.addedFlow = [addedRssData, ...state.addedFlow];
      getRenderedList(rssList, state.addedFlow[0]);
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

const updateFlow = ({ url, lastPubDate, id }) => {
  const lastPubTime = new Date(lastPubDate).getTime();
  axios.get(`${cors}${url}`)
    .then((response) => {
      const { itemsArr } = parse(response.data);
      const newItemsArr = itemsArr.filter(item => new Date(item.pubDate).getTime() > lastPubTime);
      if (!newItemsArr.length) {
        return;
      }
      getUpdatedList(id, newItemsArr);
      const itemIndexTimeChange = state.addedFlow.length - id;
      state.addedFlow[itemIndexTimeChange].lastPubDate = newItemsArr[0].pubDate;
    })
    .catch((err) => {
      throw err;
    });
};

const updateNewsOnFlow = () => {
  Promise.all(state.addedFlow.map(updateFlow))
    .then(() => setTimeout(updateNewsOnFlow, 5000));
};

formInput.addEventListener('input', handleInputValidate);
form.addEventListener('submit', handleSubmitForm);

modal.on('show.bs.modal', (event) => {
  const button = $(event.relatedTarget);
  const recipient = button.data('whatever');
  modal.find('.modal-body').text(recipient);
});

updateNewsOnFlow();
