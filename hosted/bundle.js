'use strict';

var natures = ['Lonely', 'Brave', 'Adamant', 'Naughty', 'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax', 'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive', 'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash', 'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'];

var selected = [];

var selectDomo = function selectDomo(domo) {
  domo.classList.add('selected');
  selected.push(domo);
};

var deselectDomo = function deselectDomo(which) {
  var domo = void 0;
  if (which) domo = selected.pop();else domo = selected.shift();
  domo.classList.remove('selected');
};

var domoClick = function domoClick(e) {
  var sel = e.target;

  while (sel.nodeName !== "DIV") {
    sel = sel.parentElement;
  }
  console.log(sel);
  e.preventDefault();
  for (var i = 0; i < selected.length; i++) {
    if ($(sel).is($(selected[i]))) {
      deselectDomo(i);
      return false;
    }
  }

  if (selected.length >= 2) {
    deselectDomo(0);
  }

  selectDomo(sel);

  return false;
};

var handleDomo = function handleDomo(e) {
  e.preventDefault();

  $("#domoMesssage").animate({ width: 'hide' }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }
  sendAjax('POST', $("#domoForm").attr('action'), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });
  return false;
};

var handleBabyDomo = function handleBabyDomo(e) {
  e.preventDefault();
  if (selected.length !== 2) {
    handleError("RAWR! Two parents make a baby");
    return false;
  }

  var name1 = ReactDOM.findDOMNode(selected[0].querySelector('.domoName')).innerText.substring(6);
  var name2 = ReactDOM.findDOMNode(selected[1].querySelector('.domoName')).innerText.substring(6);

  var newName = name1.substring(0, Math.ceil(name1.length / 2)) + name2.substring(name2.length / 2);

  $("#babyName").attr('value', newName);
  $("#babyAge").attr('value', 0);
  $("#babyNature").attr('value', natures[Math.floor(Math.random() * natures.length)]);

  sendAjax('POST', $("#babyDomoForm").attr('action'), $("#babyDomoForm").serialize(), function () {
    loadDomosFromServer();
  });
  deselectDomo(0);
  deselectDomo(0);
};

var BabyDomoForm = function BabyDomoForm(props) {
  return React.createElement(
    'form',
    { id: 'babyDomoForm',
      onSubmit: handleBabyDomo,
      name: 'babyForm',
      action: '/maker',
      method: 'POST',
      className: 'babyDomoForm'
    },
    React.createElement(
      'label',
      null,
      'Select two domos and make a baby!'
    ),
    React.createElement('input', { id: 'babyName', type: 'hidden', name: 'name', value: '' }),
    React.createElement('input', { id: 'babyAge', type: 'hidden', name: 'age', value: '' }),
    React.createElement('input', { id: 'babyNature', type: 'hidden', name: 'nature', value: '' }),
    React.createElement('input', { type: 'hidden', id: 'csrf', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Baby' })
  );
};

var DomoForm = function DomoForm(props) {

  var natureOptions = props.natures.map(function (nature) {
    return React.createElement(
      'option',
      { value: nature },
      nature
    );
  });

  return React.createElement(
    'form',
    { id: 'domoForm',
      onSubmit: handleDomo,
      name: 'domoForm',
      action: '/maker',
      method: 'POST',
      className: 'domoForm'
    },
    React.createElement(
      'label',
      { htmlFor: 'name' },
      'Name: '
    ),
    React.createElement('input', { id: 'domoName', type: 'text', name: 'name', placeholder: 'Domo Name' }),
    React.createElement(
      'label',
      { htmlFor: 'age' },
      'Age: '
    ),
    React.createElement('input', { id: 'domoAge', type: 'text', name: 'age', placeholder: 'Domo Age' }),
    React.createElement(
      'label',
      { htmlFor: 'nature' },
      'Nature: '
    ),
    React.createElement(
      'select',
      { id: 'nature', name: 'nature' },
      natureOptions
    ),
    React.createElement('input', { type: 'hidden', id: 'csrf', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
  );
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return React.createElement(
      'div',
      { className: 'domoList' },
      React.createElement(
        'h3',
        { className: 'emptyDomo' },
        'No Domos Yet'
      )
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    return React.createElement(
      'div',
      { key: domo._id, className: 'domo', onClick: domoClick },
      React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domo face', className: 'domoFace' }),
      React.createElement(
        'h3',
        { className: 'domoName' },
        'Name: ',
        domo.name
      ),
      React.createElement(
        'h3',
        { className: 'domoAge' },
        'Age: ',
        domo.age
      ),
      React.createElement(
        'h3',
        { className: 'domoNature' },
        'Nature: ',
        props.natures[domo.nature]
      )
    );
  });

  return React.createElement(
    'div',
    { className: 'domoList' },
    domoNodes
  );
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos, natures: natures }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(DomoForm, { csrf: csrf, natures: natures }), document.querySelector("#makeDomo"));
  ReactDOM.render(React.createElement(BabyDomoForm, { csrf: csrf }), document.querySelector("#makeBaby"));
  ReactDOM.render(React.createElement(DomoList, { domos: [], natures: natures }), document.querySelector("#domos"));

  loadDomosFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
