import { DB } from './db';
import { Wow } from './wow';

const db = new DB();
let settingsW, settingsH;
console.log('ht');
const settingsWin = (screenName) => {
  Window.this.modal({
    url: __DIR__ + 'settings-window.htm',
    caption: 'wtf',
    width: settingsW,
    height: settingsH,
    parameters: {
      screenName,
      db,
    },
  });
};

function renderRealmSelect() {
  const root = document.querySelector('#realm-container');
  const data = db.getRealmLists();
  const isThereSelected = data.some((el) => el.selected);
  if (!isThereSelected && data.length > 0) data[0].selected = true;
  let options = '';

  data.forEach((realm) => {
    const option = `<option ${realm.selected ? 'selected' : ''} key=${
      realm.id
    }>${realm.realm}</option>`;
    options += option;
  });
  let html = `
   <select|list.select#realm-select>
   ${options}
   </select>
   `;
  root.innerHTML = html;
}

function renderAccSelect() {
  const root = document.querySelector('#acc-select-wrap');
  const data = db.getAllAccs();
  const isThereSelected = data.some((el) => el.selected);
  if (!isThereSelected && data.length > 0) data[0].selected = true;
  const html = `
   <select|list.select#acc-select>
   ${data.reduce(
     (acc, el) =>
       (acc += `<option ${el.selected ? 'selected' : ''} key="${el.id}">${
         el.name
       }</option>`),
     '',
   )}
</select>
   `;
  root.innerHTML = html;
}

function renderGameSelect() {
  const root = document.querySelector('#path-select-wrap');
  const games = db.getWowPaths();
  console.log(games)
  let html = '';

  games.forEach(game=>html+=`<option ${game.selected ? 'selected=""': ''} key=${game.id}  > ${game.wowId} </option>`);

  root.innerHTML = `
    <select|list.select #wow-list>
      ${html}
    </select>`;
}



document.on('ready', () => {
  console.log('hit');
  renderRealmSelect();
  renderAccSelect();
  renderGameSelect();

});
document.on('beforeunload', () => db.destroy());


// events to open modal with apropriate props
const settingsBtn = document.querySelector('#edit-wow-btn');
settingsBtn.addEventListener('click', () => settingsWin('wow_list'));

const realmListsBtn = document.querySelector('#realmlist-btn');
realmListsBtn.addEventListener('click', () =>{
   settingsWin('realmlist_settings')
  console.log('ht')
},
);
const accountsBtn = document.querySelector('#accounts-btn');
accountsBtn.addEventListener('click', () => settingsWin('accounts_settings'));



document.querySelector('#launch-btn').addEventListener('click', async () => {
  const { exePath, realmPath, configPath } =
    db.getAppSettings();

  const realm = document
    .querySelector('#realm-select')
    .$('option:current')?.innerText;
  const acc = document
    .querySelector('#acc-select')
    .$('option:current')?.innerText;
  await Wow.addAccLogin(configPath, acc);
  await Wow.realmlistChange(realmPath, realm);
  Wow.launchWow(exePath);
});

document.on('db-update', () => {
  //re render
  renderRealmSelect();
  renderAccSelect();
  renderGameSelect();
});

document.on('click', 'select#realm-select', (e) => {
  const key = e.target.getAttribute('key');
  db.realmListSelected(key);
});

document.on('click', 'select#acc-select', (e) => {
  const key = e.target.getAttribute('key');
  db.selectAccount(key);
});

document.on('click', 'select#wow-list', (e) => {
  const key = e.target.getAttribute('key');
  db.selectWowPath(key);
});



function windowResizer() {
  let appWidth, appHeight;
  let [, , monitorWidth, monitorHeight] = Window.this.screenBox('workarea');

  //for  css testing
  //  monitorWidth = 3840;

  switch (true) {
    case monitorWidth > 1600 && monitorWidth < 2560: //1920x1080 (Full HD or 1080p)
      (appWidth = 1150), (appHeight = 400);
      (settingsW = 800), (settingsH = 400);

      break;
    case monitorWidth > 1920 && monitorWidth < 3840: //2560x1440 (QHD or 1440p)
      (appWidth = 1280), (appHeight = 500);
      (settingsW = 900), (settingsH = 500);
      break;
    case monitorWidth > 2560: //3840x2160 (4K or UHD)
      (appWidth = 1600), (appHeight = 1000);
      (settingsW = 1000), (settingsH = 1000);
      break;
    default: //under 1080p
      (appWidth = 850), (appHeight = 300);
      (settingsW = 500), (settingsH = 300);

      break;
  }

  Window.this.move(
    monitorWidth / 4,
    monitorHeight / 4,
    appWidth,
    appHeight,
    'client',
  );
}

windowResizer();
