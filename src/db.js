import * as Storage from "@storage";
import * as Env from "@env";
import * as Sciter from "@sciter";
class DB {

  constructor() {
     const storage = Storage.open(Env.path("documents") + "/wow-launcher.db");
     this.storage = storage;
     this.root = storage.root || DB.initDb(storage);
  }
static initDb(storage) {
  storage.root = {
     version: 1,
     realmListById: storage.createIndex("string", true) // list of notes indexed by their UID
  }
  return storage.root;
}
destroy(){
  this.root = undefined;
  this.storage.close();
  this.storage = undefined;
}
addRealmList(realmStr) {
  const id = Sciter.uuid()
  this.root.realmListById.set(id, {
     realm: realmStr,id,
     selected:false
  })
  this.storage.commit()
  this.eventDbUpdate()
}
deleteRealmList(id) {
  this.root.realmListById.delete(id)
  this.eventDbUpdate()
}

/**
 *
 * @returns [ ] array of {id:number,realm:string,selected:boolean}
 */
getRealmLists() {
  const index = this.root.realmListById
  const res = [];
  for (var obj of index)
     res.push(obj)
  return res;
}

getRealmListById(id) {
  const realmlist = this.root.realmListById.get(id)
 return realmlist
}
/**
 * only to update realm string
 * @param {string} id
 * @param {string} value
 */
editRealmList(id, value) {
  const obj = this.getRealmListById(id);
  obj.realm = value;
  this.root.realmListById.set(id, obj);
  this.storage.commit();
  this.eventDbUpdate()
}
realmListSelected(id) {
  const allRealms = this.getRealmLists();
  const oldSelected = allRealms.find(el=>el.selected === true);
  if(oldSelected){
    oldSelected.selected = false;
    this.root.realmListById.set(oldSelected.id, oldSelected)
  }
  const newSelected = this.getRealmListById(id);
  newSelected.selected = true;
  this.root.realmListById.set(id, newSelected)

}

eventDbUpdate() {
  document.post(new Event("db-update",{bubbles:true,data:this}));
}

}

 export const db = new DB()

