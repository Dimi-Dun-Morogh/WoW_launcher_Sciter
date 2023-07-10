// import {
//   db
// } from './db';
let db;

const data = {
  1: 'set realmlist wocserver.org',
  2: 'set realmlist 1wocserver.org',
  3: 'set realmlist wocserver.org11',
}


class Settings {
  rootHtml;
  constructor(root) {
    this.rootHtml = root;
  }


  realmListsHTML() {
    let inputHtml = '';
    const data = db.getRealmLists();
    data.forEach(realm => {
      const inputWrap = `
      <div.settings-input-wrap key=${realm.id}>
      <input|text(textEdit) .settings-input value="${realm.realm}" /> <button#settings-btn .realm-edit .btn><icon|i-tick  .center/></button>
      <button#settings-btn .realm-delete-btn  .btn><icon|i-cross   .center/></button>
    </div>
      `;
      inputHtml += inputWrap;
    })
    const html = `
    <h1>edit realmlists</h1>
    <div.settings-input-wrap .add-settings-wrap>
    <input|text(textEdit) .settings-input #addRealmInput novalue="set realmlist xxxxxx" value="set realmlist "/> <button#add-realmlist-btn .btn><icon|plus  .center/></button>
    <!-- <button#settings-btn .btn><icon|i-cross   .center/></button> -->
  </div>
  ${inputHtml}
  </div>
    `;
    this.rootHtml.innerHTML = html;
  }

  accountsHTML() {
    const html =
      `
    <h1>edit accounts</h1>
    <div.settings-input-wrap .add-settings-wrap>
      <input|text(textEdit) .settings-input  novalue="enter account name"/> <button#settings-btn .btn><icon|plus  .center/></button>
      <!-- <button#settings-btn  .btn><icon|i-cross   .center/></button> -->
    </div>
    <div.settings-input-wrap>
      <input|text(textEdit) .settings-input value="accountname" /> <button#settings-btn .btn><icon|i-tick  .center /></button>
      <button#settings-btn .btn><icon|i-cross   .center/></button>
    </div>
    `
    this.rootHtml.innerHTML = html;
  }

  wowPathsHTML() {
    const html = `
    <h1>enter path to WoW folders</h1>
    <h3.input-title>TBC WOW PATH</h3>
    <div.settings-input-wrap>
      <input|text(textEdit) .settings-input value="" /> <button#settings-btn .btn><icon|i-tick  .center /></button>
  </div>

    <div.test>
    <h3.input-title>WoTLK WOW PATH</h3>
    </div>

  <div.settings-input-wrap>
    <input|text(textEdit) .settings-input value="" novalue="D:\World of Warcraft 3.3.5a(example)"/> <button#settings-btn .btn><icon|i-tick  .center/></button>
  </div>
    `;
    this.rootHtml.innerHTML = html;
  }

  renderSettings(pageStr) {
    switch (pageStr) {
      case 'realmlist_settings':
        this.realmListsHTML();
        break;
      case 'accounts_settings':
        this.accountsHTML();
        break;
      case 'path_settings':
        this.wowPathsHTML();
        break;
      default:
        this.realmListsHTML();
        break;
    }
  }
}

const settings = new Settings(document.querySelector('#settings-inner'));

document.on("click", "button.realm-delete-btn", function (e) {
  const btn = e.target;
  const parent = btn.parentElement;

  const id = parent.getAttribute('key')
  db.deleteRealmList(id);
  settings.realmListsHTML();
});

document.on("click", "button.realm-edit", function (e) {
  const btn = e.target;
  const parent = btn.parentElement;
  const inputValue = parent.querySelector('input').value
  const id = parent.getAttribute('key')
  db.editRealmList(id, inputValue)
  settings.realmListsHTML();
});

document.on("click",  "#add-realmlist-btn", function(e){
  const btn = e.target;
  const parent = btn.parentElement;
  const inputValue = parent.querySelector('input').value

  db.addRealmList(inputValue);
  settings.realmListsHTML();
})


document.on("ready", function () {

  var passedParameters = Window.this.parameters; // { foo:"bar" here }


  Window.this.caption = passedParameters.screenName;
  db = passedParameters.db;


  settings.renderSettings(passedParameters.screenName);


})

 document.on('unload', () => {
    // PubSub: notify potential observers
    console.log('unload')
    document.post(new Event("settings-closed",{bubbles:true,data:this}));
 })