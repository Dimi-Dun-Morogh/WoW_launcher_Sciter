// import { DB } from './db';
// // import { Wow } from './wow';

// const db = new DB();
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
    <h2>edit realmlists</h2>
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
    const html = `
    <h2>edit accounts</h2>
    <div.settings-input-wrap .add-settings-wrap>
      <input|text(textEdit) .settings-input  novalue="enter account name"/> <button#addaccount-btn .btn><icon|plus  .center/></button>
      <!-- <button#settings-btn  .btn><icon|i-cross   .center/></button> -->
    </div>
    ${accounts.reduce((acc, el) => {
      acc += `
      <div.settings-input-wrap key="${el.id}">
      <input|text(textEdit) .settings-input value="${el.name}" /> <button#settings-btn .acc-edit .btn><icon|save  .center /></button>
      <button#settings-btn .acc-delete .btn><icon|i-cross   .center/></button>
    </div>
      `;
      return acc;
    }, '')}
    `;
    this.rootHtml.innerHTML = html;
  }

  WoWListHTML() {
    const data = db.getWowPaths();
    const html = `
    <h2> wow list</h2>
    <button#add-wow-path-btn .big-btn .wow-edit .btn><icon|i-plus  .center/></button>
    ${data.reduce((acc, el) => {
      acc += `
      <div.settings-input-wrap key=${el.id}>
      <input|text(textEdit) .settings-input value="${el.wowId}" disabled/>
      <button#settings-btn .wow-edit .btn><icon|edit  .center /></button>
      <button#settings-btn .wow-delete .btn><icon|i-cross   .center/></button>
       </div>
      `;
      return acc;
    }, '')}

    `;
    this.rootHtml.innerHTML = html;
  }

  wowPathsHTML(id) {
    const data = id ? db.getWowPathsById(id) : {};

    const html = `
    <h2>your .exe & realmlist|config.wtf paths</h2>

    <form key=${id}>
    <h3.input-title>WoW exe path</h3>
    <div.settings-input-wrap>
    <input |text(exePath) #realm-path-input .settings-input .path-input disabled

    ${
      data.exePath
        ? `value="${data.exePath}"`
        : 'placeholder="D:\\WoW_TBC_2.4.3\\Wow.exe"'
    }
    />
    <button  .btn .wow-paths-btn data="exe-path"><icon|edit  .center /></button>
    </div>

    <h3.input-title>realmlist path</h3>
    <div.settings-input-wrap>
    <input|text(realmPath) disabled #tbc-path-input .settings-input .path-input  ${
      data.realmPath
        ? `value="${data.realmPath}"`
        : 'placeholder="D:\\WoW_TBC_2.4.3\\realmlist.wtf(example)"'
    }

    />
    <button.btn .wow-paths-btn data="realm-path"><icon|edit  .center /></button>
    </div>

    <h3.input-title>WTF\\Config.wtf path</h3>
    <div.settings-input-wrap>
    <input|text(configPath)  #tbc-path-input .settings-input .path-input disabled ${
      data.configPath
        ? `value="${data.configPath}"`
        : 'placeholder="D:\\WoW_TBC_2.4.3\\WTF\\Config.wtf"'
    }

    />
    <button  .btn .wow-paths-btn data="config-path"><icon|edit  .center /></button>
    </div>

    <h3.input-title>ID (ex. - TBC, Cata, etc)</h3>
    <div.settings-input-wrap>
    <input|text(wowId) #tbc-path-input .settings-input .path-input  ${
      data.wowId ? `value="${data.wowId}"`  : 'placeholder="myWoW1(example)"'
    }/>
    </div>

    </form>
    <button #wow_list_ok_btn .btn><icon|i-tick  .center /></button>

    `;

    this.rootHtml.innerHTML = html;
  }

  toggleGreen(btn, input) {
    btn.style.setProperty('background-color', 'green');
    input.style.setProperty('border-color', 'green');
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
      case 'wow_list':
        this.WoWListHTML();
        break;
      default:
        this.realmListsHTML();
        break;
    }
  }
}

const settings = new Settings(document.querySelector('#settings-inner'));

//TODO use switch/case or something
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
  settings.toggleGreen(e.target, e.target.parentElement.querySelector('input'));
});

document.on('click', '.realmlist-path-edit', function (e) {
  const parent = e.target.parentElement;
  const inputValue = parent.querySelector('input').value;
  db.setWotlkRealmlist(inputValue);
  settings.toggleGreen(e.target, e.target.parentElement.querySelector('input'));
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

  settings.toggleGreen(e.target, e.target.parentElement.querySelector('input'));
});

document.on('click', '.path-edit', (e) => {
  const input = e.target.parentElement.querySelector('input');
  db.setWoWPath(input.getAttribute('key'), input.value);
  settings.toggleGreen(e.target, input);
});

document.on('click', '.wow-edit', (e) => {
  // const input = e.target.parentElement.querySelector('input')
  // db.setWoWPath( input.getAttribute("key"),input.value);
  // settings.toggleGreen(e.target, input)
  const id = e.target.parentElement.getAttribute('key');

  settings.wowPathsHTML(id);
});

document.on('click', '.wow-delete', (e) => {
  const id = e.target.parentElement.getAttribute('key');
  db.deleteWowPaths(id);
  settings.WoWListHTML();
});

document.on('click', '#wow_list_ok_btn', (e) => {
  // TODO some error handlng on empty  value or add default 'null' to realmlist wtfconfig'
  const values = document.$('form').value;
  console.log(values);
  const { exePath, realmPath, wowId, configPath } = values;
  if (exePath && realmPath && wowId) {
    const id = document.$('form').getAttribute('key');
    if (id !== 'null') {
      db.updateWowPaths(id, { exePath, realmPath, wowId, configPath });
    } else {
      db.addWowPaths({ exePath, realmPath, wowId, configPath });
    }

    settings.WoWListHTML();
  }
});

document.on('click', '.wow-paths-btn', (e) => {
  const dataAttr = e.target.attributes['data'];

  let caption = '';
  let filter = '';
  if (dataAttr === 'exe-path') {
    caption = 'SELECT your wow exe file';
    filter = 'wow.exe|*.exe';
  } else {
    const word = dataAttr.split('-')[0];
    caption = `SELECT ${word}.WTF file`;
    filter = `${word}.wtf|*.WTF`;
  }

  const filePath = Window.this.selectFile({ mode: 'open', filter, caption });
  if (filePath) {
    const inputName =
      dataAttr === 'exe-path'
        ? 'exePath'
        : dataAttr === 'realm-path'
        ? 'realmPath'
        : 'configPath';
    const input = document.querySelector(`input[name="${inputName}"]`);
    input.value = filePath
      .replace('file://', '')
      .replaceAll('/', '\\')
      .replaceAll('%20', ' ');
  }
});

document.on('ready', function () {
  var passedParameters = Window.this.parameters; // { foo:"bar" here }

  Window.this.caption = passedParameters.screenName;
  db = passedParameters.db;

  //  settings.renderSettings('wow_list');

  settings.renderSettings(passedParameters.screenName);
});
