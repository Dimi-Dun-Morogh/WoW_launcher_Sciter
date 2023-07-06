// import * as sys from "@sys"; // '@' is mandatory


// const myButton = document.querySelector("#launch-btn")
// myButton.addEventListener('click',()=>{


//  //env.exec("D:\\WoW_TBC_2.4.3\\Wow.exe")
//  // sys.spawn(["Wow.exe"])
//   console.log('hello')

// }
// )

const settingsWin = (screenName)=>{
   Window.this.modal({url: __DIR__ + "settings-window.htm", caption:'wtf', parameters: screenName}, );
}

const settingsBtn = document.querySelector("#settings-btn");
settingsBtn.addEventListener('click', () => settingsWin('path_settings'))
const realmListsBtn = document.querySelector("#realmlist-btn")
realmListsBtn.addEventListener('click', () => settingsWin('realmlist_settings'))
const accountsBtn = document.querySelector("#accounts-btn")
accountsBtn.addEventListener('click', () => settingsWin('accounts_settings'))