const data = {
  1:'set realmlist wocserver.org',
  2: 'set realmlist 1wocserver.org',
  3: 'set realmlist wocserver.org11',
  4: 'set realmlist wocserver.org11',
  5: 'set realmlist wocserver.org11',
  6: 'set realmlist wocserver.org11',
  7: 'set realmlist wocserver.org11',
  8: 'set realmlist wocserver.org11',
  9: 'set realmlist wocserver.org11',
  10: 'set realmlist wocserver.org11',
  11: 'set realmlist wocserver.org11',
  12: 'set realmlist wocserver.org11',
}


class Settings {
   rootHtml;
   constructor(root){
    this.rootHtml = root;
   }


  realmListsHTML(){
    const html = `
    <h1>edit realmlists</h1>
    <div.settings-input-wrap .add-settings-wrap>
    <input|text(textEdit) .settings-input  novalue="set realmlist xxxxxx"/> <button#settings-btn .btn><icon|plus  .center/></button>
    <!-- <button#settings-btn .btn><icon|i-cross   .center/></button> -->
  </div>
  ${Object.entries(data).reduce((acc,[key,value])=>{
    acc+=`
    <div.settings-input-wrap>
    <input|text(textEdit) .settings-input value="${value}" /> <button#settings-btn .btn><icon|i-tick  .center/></button>
    <button#settings-btn .btn><icon|i-cross   .center/></button>
  </div>
    `;
    return acc;
  },'')}
  <div.settings-input-wrap>
    <input|text(textEdit) .settings-input value="set realmlist wocserver.org" /> <button#settings-btn .btn><icon|i-tick  .center/></button>
    <button#settings-btn .btn><icon|i-cross   .center/></button>
  </div>

  </div>
    `;

    this.rootHtml.innerHTML = html;
  }

  accountsHTML(){
    const html =
    `
    <h1>edit accounts</h1>
    <div.settings-input-wrap .add-settings-wrap>
      <input|text(textEdit) .settings-input  novalue="enter account name"/> <button#settings-btn .btn><icon|plus  .center/></button>
      <!-- <button#settings-btn .btn><icon|i-cross   .center/></button> -->
    </div>
    <div.settings-input-wrap>
      <input|text(textEdit) .settings-input value="accountname" /> <button#settings-btn .btn><icon|i-tick  .center /></button>
      <button#settings-btn .btn><icon|i-cross   .center/></button>
    </div>
    `
    this.rootHtml.innerHTML = html;
  }

  wowPathsHTML(){
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
        break;
    }
  }
}

const settings = new Settings(document.querySelector('#settings-inner'));



document.on("ready", function() {

var passedParameters =  Window.this.parameters; // { foo:"bar" here }
 Window.this.caption = passedParameters;


 settings.renderSettings(passedParameters);
})

