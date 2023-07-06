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

const root = document.querySelector('#settings-inner');

function pop() {
  var passedParameters =  Window.this.parameters; // { foo:"bar" here }
  Window.this.caption = passedParameters;
  const html = `
  <h1>edit realmlists</h1>
  <div.settings-input-wrap .add-settings-wrap>
  <input|text(textEdit) .settings-input  novalue="set realmlist xxxxxx"/> <button#settings-btn .btn><icon|plus  .center .btn/></button>
  <!-- <button#settings-btn .btn><icon|i-cross   .center .btn/></button> -->
</div>
${Object.entries(data).reduce((acc,[key,value])=>{
  acc+=`
  <div.settings-input-wrap>
  <input|text(textEdit) .settings-input value="${value}" /> <button#settings-btn .btn><icon|i-tick  .center .btn/></button>
  <button#settings-btn .btn><icon|i-cross   .center .btn/></button>
</div>
  `;
  return acc;
},'')}
<div.settings-input-wrap>
  <input|text(textEdit) .settings-input value="set realmlist wocserver.org" /> <button#settings-btn .btn><icon|i-tick  .center .btn/></button>
  <button#settings-btn .btn><icon|i-cross   .center .btn/></button>
</div>

</div>
  `;

  root.innerHTML = html;
}

document.on("ready", function() {

var passedParameters =  Window.this.parameters; // { foo:"bar" here }
 Window.this.caption = passedParameters.foo;
  pop()
})

