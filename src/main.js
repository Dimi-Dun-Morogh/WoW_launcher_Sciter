// import * as sys from "@sys"; // '@' is mandatory


// const myButton = document.querySelector("#launch-btn")
// myButton.addEventListener('click',()=>{


//  //env.exec("D:\\WoW_TBC_2.4.3\\Wow.exe")
//  // sys.spawn(["Wow.exe"])
//   console.log('hello')

// }
// )
import {
   db
} from './db';
const settingsWin = (screenName) => {
   Window.this.modal({
      url: __DIR__ + "settings-window.htm",
      caption: 'wtf',
      parameters: {
         screenName,
         db
      }
   }, );
}

function renderRealmSelect() {
   const root = document.querySelector('#realm-container');
   const data = db.getRealmLists();
   const isThereSelected = data.some(el=>el.selected);
   if(!isThereSelected && data.length  > 0) data[0].selected = true;
   let options  = '';

   data.forEach(realm => {
      const option = `<option ${realm.selected ? 'selected=""': ''} key=${realm.id}>${realm.realm}</option>`;
      options += option;
   })
   let html = `
   <select|list.select#realm-select>
   ${options}
   </select>
   `;
   root.innerHTML = html;
}

function renderAccSelect(){
   const root = document.querySelector('#acc-select-wrap');
   const data = db.getAllAccs();
   const isThereSelected = data.some(el=>el.selected);
   if(!isThereSelected && data.length  > 0) data[0].selected = true;
   const html = `
   <select|list.select#acc-select>
   ${data.reduce((acc,el)=>acc+=`<option ${el.selected ? 'selected=""': ''} key="${el.id}">${el.name}</option>`, '')}
</select>
   `;
   root.innerHTML = html;
}

function appMode() {
   const data = db.getAppMode();
   console.log(data)
   const btns = document.querySelector('#wow-v-select').querySelectorAll('button');;
   btns.forEach(el=>{
      if(el.getAttribute("key") === data)  el.state.checked = true;
      else (el.state.checked = false)
   })
   document.body.style.backgroundImage = `url('bg${data}.jpg')`;
}

document.on('ready', () => {

   renderRealmSelect();
   renderAccSelect()
   appMode()
})
document.on('beforeunload', () => db.destroy())

const settingsBtn = document.querySelector("#settings-btn");
settingsBtn.addEventListener('click', () => settingsWin('path_settings'))
const realmListsBtn = document.querySelector("#realmlist-btn")
realmListsBtn.addEventListener('click', () => settingsWin('realmlist_settings'))
const accountsBtn = document.querySelector("#accounts-btn")
accountsBtn.addEventListener('click', () => settingsWin('accounts_settings'))



document.on("db-update",()=>{
   //re render
   renderRealmSelect();
   renderAccSelect()
})


document.on("click",  "select#realm-select", (e)=>{
   const key = e.target.getAttribute("key");
   db.realmListSelected(key)
})

document.on("click",  "select#acc-select", (e)=>{
   const key = e.target.getAttribute("key");
   db.selectAccount(key)
})

document.on("click", "#wow-v-select",(e)=>{
   const key = e.target.getAttribute("key");
   db.setAppMode(key);
   document.body.style.backgroundImage = `url('bg${key}.jpg')`;
})