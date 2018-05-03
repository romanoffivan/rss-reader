import 'bootstrap';
import validator from 'validator';
import axios from 'axios';
import $ from 'jquery';
import './main.scss';
import parse from './parse';
import renderList from './render';

const form = document.getElementById('rss-form');
const formInput = form.querySelector('.form-input');
const formBtn = form.querySelector('.btn');
const rssList = $('.rss-list');
const modal = $('#descriptionModal');
const cors = 'https://cors-anywhere.herokuapp.com/';

const state = {
  address: '',
  addedFlow: [],
  formValid: true,
};


const handleInputValidate = () => {
  state.address = `${formInput.value}`;
  const chekAddress = state.address;
  const formValid = validator.isURL(chekAddress);
  if (!formValid) {
    formInput.classList.add('is-invalid');
    formBtn.disabled = true;
  }
  if (formValid || !chekAddress) {
    formInput.classList.remove('is-invalid');
    formBtn.disabled = false;
  }
};

const handleSubmitForm = (event) => {
  event.preventDefault();
  const urlCors = `${cors}${state.address}`;
  if (state.addedFlow.find(data => data.url === state.address)) {
    state.formValid = false;
    formInput.classList.add('is-invalid');
    return;
  }
  axios.get(urlCors)
    .then((response) => {
      const { title, description, itemsArr } = parse(response.data);
      const addedRssData = {
        title,
        description,
        itemsArr,
        url: state.address,
        lastPubDate: itemsArr[0].pubDate,
      };
      state.addedFlow = [addedRssData, ...state.addedFlow];
      renderList(rssList, state.addedFlow[0]);
      formInput.value = '';
      state.formValid = true;
      state.address = '';
    })
    .catch((err) => {
      console.log(err);
    });
};

formInput.addEventListener('input', handleInputValidate);
form.addEventListener('submit', handleSubmitForm);

modal.on('show.bs.modal', (event) => {
  const button = $(event.relatedTarget);
  const recipient = button.data('whatever');
  modal.find('.modal-body').text(recipient);
});
