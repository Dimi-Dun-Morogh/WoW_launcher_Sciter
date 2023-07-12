// import {
//   db
// } from './db';
let db;

class Settings {
  rootHtml;
  constructor(root) {
    this.rootHtml = root;
  }

  realmListsHTML() {
    let inputHtml = '';
    const data = db.getRealmLists();
    data.forEach((realm) => {
      const inputWrap = `
      <div.settings-input-wrap key=${realm.id}>
      <input|text(textEdit) .settings-input value="${realm.realm}" /> <button#settings-btn .realm-edit .btn><icon|i-tick  .center/></button>
      <button#settings-btn .realm-delete-btn  .btn><icon|i-cross   .center/></button>
    </div>
      `;
      inputHtml += inputWrap;
    });
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
    const accounts = db.getAllAccs();
    console.log(accounts);
    const html = `
    <h1>edit accounts</h1>
    <div.settings-input-wrap .add-settings-wrap>
      <input|text(textEdit) .settings-input  novalue="enter account name"/> <button#addaccount-btn .btn><icon|plus  .center/></button>
      <!-- <button#settings-btn  .btn><icon|i-cross   .center/></button> -->
    </div>
    ${accounts.reduce((acc, el) => {
      acc += `
      <div.settings-input-wrap key="${el.id}">
      <input|text(textEdit) .settings-input value="${el.name}" /> <button#settings-btn .acc-edit .btn><icon|i-tick  .center /></button>
      <button#settings-btn .acc-delete .btn><icon|i-cross   .center/></button>
    </div>
      `;
      return acc;
    }, '')}
    `;
    this.rootHtml.innerHTML = html;
  }

  wowPathsHTML() {
    const data = db.getAppSettings();
    const html = `
    <h1>enter path to WoW folders</h1>
    <h3.input-title>TBC WOW FOLDER PATH</h3>
    <div.settings-input-wrap>
      <input|text(textEdit) .settings-input value="${data.tbcFolderPath}" key="tbcFolderPath"/> <button#settings-btn .path-edit .btn><icon|i-tick  .center /></button>
  </div>

    <div.test>
    <h3.input-title>WoTLK WOW FOLDER PATH</h3>
    </div>

  <div.settings-input-wrap>
    <input|text(textEdit) key="wotlkFolderPath"  .settings-input value="${data.wotlkFolderPath}" novalue="D:\World of Warcraft 3.3.5a(example)"/> <button#settings-btn .path-edit .btn ><icon|i-tick  .path-edit .center/></button>
  </div>
  <h3.input-title>WoTLK REALMLIST FOLDER PATH</h3>
  <div.settings-input-wrap>
  <input|text(textEdit) key="wotlkFolderPath"  .settings-input value="${data.wotlkRealmlist}" /> <button#settings-btn .realmlist-path-edit.btn ><icon|i-tick   .center/></button>
</div>
    `;
    this.rootHtml.innerHTML = html;
  }

  toggleGreen(btn, input){
    btn.style.setProperty("background-color", "green")
    input.style.setProperty("border-color", "green")
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

document.on('click', 'button.realm-delete-btn', function (e) {
  const id = e.target.parentElement.getAttribute('key');
  db.deleteRealmList(id);
  settings.realmListsHTML();
});

document.on('click', 'button.realm-edit', function (e) {
  const parent = e.target.parentElement;
  const inputValue = parent.querySelector('input').value;
  const id = parent.getAttribute('key');
  db.editRealmList(id, inputValue);
  settings.toggleGreen(e.target, e.target.parentElement.querySelector('input'))
});

document.on('click', '.realmlist-path-edit', function (e) {
  const parent = e.target.parentElement;
  const inputValue = parent.querySelector('input').value;
  db.setWotlkRealmlist(inputValue);
  settings.toggleGreen(e.target, e.target.parentElement.querySelector('input'))
});

document.on('click', '#add-realmlist-btn', function (e) {
  const inputValue = e.target.parentElement.querySelector('input').value;
  db.addRealmList(inputValue);
  settings.realmListsHTML();
});

document.on('click', '#addaccount-btn', (e) => {
  const inputValue = e.target.parentElement.querySelector('input').value;
  db.addAccount(inputValue);
  settings.accountsHTML();
});
document.on('click', '.acc-delete', (e) => {
  const id = e.target.parentElement.getAttribute('key');
  db.deleteAcc(id);
  settings.accountsHTML();
});

document.on('click', '.acc-edit', (e) => {
  const id = e.target.parentElement.getAttribute('key');
  const name = e.target.parentElement.querySelector('input').value;
  db.editAccName(id, name);

//  settings.accountsHTML();
  settings.toggleGreen(e.target, e.target.parentElement.querySelector('input'))

});

document.on('click', '.path-edit', e => {
  const input = e.target.parentElement.querySelector('input')
  db.setWoWPath( input.getAttribute("key"),input.value);
  settings.toggleGreen(e.target, input)
})

document.on('ready', function () {
  var passedParameters = Window.this.parameters; // { foo:"bar" here }

  Window.this.caption = passedParameters.screenName;
  db = passedParameters.db;

  settings.renderSettings(passedParameters.screenName);
});