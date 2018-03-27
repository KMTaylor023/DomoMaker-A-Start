const natures = ['Lonely','Brave','Adamant','Naughty',
                 'Bold','Docile','Relaxed','Impish',
                 'Lax','Timid','Hasty','Serious',
                 'Jolly','Naive','Modest','Mild',
                 'Quiet','Bashful','Rash','Calm',
                 'Gentle','Sassy','Careful','Quirky'];

const selected = [];

const selectDomo = (domo) => {
  domo.classList.add('selected');
  selected.push(domo);
};

const deselectDomo = (which) => {
  let domo;
  if(which) domo = selected.pop();
  else domo = selected.shift();
  domo.classList.remove('selected');
};

const domoClick = (e) => {
  let sel = e.target;
  
  while(sel.nodeName !== "DIV"){
    sel = sel.parentElement;
  }
  console.log(sel);
  e.preventDefault();
  for(let i = 0; i < selected.length; i++){
    if($(sel).is($(selected[i]))){
      deselectDomo(i);
      return false;
    }
  }
  
  if(selected.length >= 2){
    deselectDomo(0);
  }
  
  selectDomo(sel);
  
  return false;
};

const handleDomo = (e) => {
  e.preventDefault();
  
  $("#domoMesssage").animate({width:'hide'}, 350);
  
  if($("#domoName").val() == '' || $("#domoAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }
  sendAjax('POST', $("#domoForm").attr('action'), $("#domoForm").serialize(), function() {
    loadDomosFromServer();
  });
  return false;
};

const handleBabyDomo = (e) => {
  e.preventDefault();
  if(selected.length !== 2){
    handleError("RAWR! Two parents make a baby");
    return false;
  }
  
  const name1 = ReactDOM.findDOMNode(selected[0].querySelector('.domoName')).innerText.substring(6);
  const name2 = ReactDOM.findDOMNode(selected[1].querySelector('.domoName')).innerText.substring(6);
  
  const newName = name1.substring(0,Math.ceil(name1.length/2)) +      
                  name2.substring(name2.length/2);
  
  $("#babyName").attr('value',newName);
  $("#babyAge").attr('value',0);
  $("#babyNature").attr('value',natures[Math.floor(Math.random()*natures.length)]);
  
  sendAjax('POST', $("#babyDomoForm").attr('action'), $("#babyDomoForm").serialize(), function() {
    loadDomosFromServer();
  });
  deselectDomo(0);
  deselectDomo(0);
};

const BabyDomoForm = (props) => {
  return (
    <form id="babyDomoForm"
          onSubmit={handleBabyDomo}
          name="babyForm"
          action="/maker"
          method="POST"
          className="babyDomoForm"
      >
      <label>Select two domos and make a baby!</label>
      <input id="babyName" type="hidden" name="name"  value=""/>
      <input id="babyAge" type="hidden" name="age" value=""/>
      <input id="babyNature"  type="hidden" name="nature" value=""/>
      <input type="hidden" id="csrf" name="_csrf" value={props.csrf}/>
      <input className="makeDomoSubmit" type="submit" value="Make Baby"/>
    </form>
  );
}

const DomoForm = (props) => {
  
  const natureOptions = props.natures.map(function(nature) {
    return (
      <option value={nature}>{nature}</option>
    );
  });
  
  return (
    <form id="domoForm"
          onSubmit={handleDomo}
          name="domoForm"
          action="/maker"
          method="POST"
          className="domoForm"
      >
      <label htmlFor="name">Name: </label>
      <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
      <label htmlFor="age">Age: </label>
      <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
      <label htmlFor="nature">Nature: </label>
      <select id="nature" name="nature">{natureOptions}</select>
      <input type="hidden" id="csrf" name="_csrf" value={props.csrf}/>
      <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
    </form>
  );
};


const DomoList = function(props) {
  if(props.domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No Domos Yet</h3>
      </div>
    );
  }
  
  const domoNodes = props.domos.map(function(domo) {
    return (
      <div key={domo._id} className="domo" onClick={domoClick}>
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
        <h3 className="domoName">Name: {domo.name}</h3>
        <h3 className="domoAge">Age: {domo.age}</h3>
        <h3 className="domoNature">Nature: {props.natures[domo.nature]}</h3>
      </div>
    );
  });
  
  return (
    <div className="domoList">
      {domoNodes}
    </div>
  );
};

const loadDomosFromServer = () => {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} natures={natures}/>,document.querySelector("#domos")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <DomoForm csrf={csrf} natures={natures} />, document.querySelector("#makeDomo")
  );
  ReactDOM.render(
    <BabyDomoForm csrf={csrf} />, document.querySelector("#makeBaby")
  );
  ReactDOM.render(
    <DomoList domos={[]} natures={natures} />, document.querySelector("#domos")
  );
  
  loadDomosFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});