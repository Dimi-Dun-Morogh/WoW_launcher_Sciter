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

document.on('ready', () => {

   renderRealmSelect();
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
})


document.on("click",  "select#realm-select", function(e){
   const key = e.target.getAttribute("key");
   db.realmListSelected(key)
})