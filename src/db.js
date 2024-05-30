import * as Storage from '@storage';
import * as Env from '@env';
import * as Sciter from '@sciter';

/**
 * @typedef appState
 * @type {object}
 * @property {string} version - number
 * @property {object} realmListById - sciter storage Index collection, iterable  [key:string]:{realm:string, selected: boolean, id:string}
 * @property {appSettings} appSettings
 * @property {account[]} accounts
 * @property {wowPaths[]} paths
 *
 */
/**
 * @typedef realmlist
 * @type {object}
 * @property {string} id - string
 * @property {boolean} selected
 * @property {string} realm
 */
/**
 * @typedef account
 * @type {object}
 * @property {string} name
 * @property {string} id - string
 * @property {boolean} selected
 */

/**
 * @typedef  wowPaths
 * @type {object}
 * @property {string} exePath
 * @property {string} realmPath
 * @property {string} configPath
 * @property {string} wowId
 * @property {string} id
 * @property {boolean} selected
 */

export class DB {
  constructor() {
    const storage = Storage.open(Env.path('documents') + '/wow-launcher11.db');
    this.storage = storage;
    /** @type {appState} */
    this.root = storage.root || DB.initDb(storage);
  }
  static initDb(storage) {
    storage.root = {
      version: 1,
      realmListById: storage.createIndex('string', true), // list of notes indexed by their UID
      appSettings: {
        tbcFolderPath: '',
        wotlkFolderPath: '',
        wotlkRealmlist: '',
        appMode: 'tbc',
      },
      accounts: [],
      paths: [
        { id: 1, exePath: '', realmPath: '', wowId: 'example', selected: true },
      ],
    };
    return storage.root;
  }
  destroy() {
    this.root = undefined;
    this.storage.close();
    this.storage = undefined;
  }
  /**
   *
   * @param {string} realmStr
   */
  addRealmList(realmStr) {
    const id = Sciter.uuid();
    this.root.realmListById.set(id, {
      realm: realmStr,
      id,
      selected: false,
    });
    this.storage.commit();
    this.eventDbUpdate();
  }
  deleteRealmList(id) {
    this.root.realmListById.delete(id);
    this.eventDbUpdate();
  }

  /**
   *
   * @returns {realmlist[]}
   */
  getRealmLists() {
    const index = this.root.realmListById;
    const res = [];
    for (var obj of index) res.push(obj);
    return this.#unshiftSelected(res);
  }

  /**
   *
   * @param {string} id
   * @returns {realmlist}
   */
  getRealmListById(id) {
    const realmlist = this.root.realmListById.get(id);
    return realmlist;
  }
  /**
   * only to update realm string
   * @param {string} id
   * @param {string} value realmname
   */
  editRealmList(id, value) {
    const obj = this.getRealmListById(id);
    obj.realm = value;
    this.root.realmListById.set(id, obj);
    this.storage.commit();
    this.eventDbUpdate();
  }
  /**
   * update selected state
   * @param {string} id
   */
  realmListSelected(id) {
    const allRealms = this.getRealmLists();
    const oldSelected = allRealms.find((el) => el.selected === true);
    if (oldSelected) {
      oldSelected.selected = false;
      this.root.realmListById.set(oldSelected.id, oldSelected);
    }
    const newSelected = this.getRealmListById(id);
    newSelected.selected = true;
    this.root.realmListById.set(id, newSelected);
  }

  addAccount(accName) {
    const newAcc = {
      name: accName,
      id: Sciter.uuid(),
      selected: false,
    };
    this.root.accounts.unshift(newAcc);
    this.storage.commit();
    this.eventDbUpdate();
  }
  getAccount(id) {
    return this.root.accounts.find((el) => el.id === id);
  }
  getAllAccs() {
    return this.root.accounts;
  }
  deleteAcc(id) {
    const oldAccs = this.getAllAccs();
    this.root.accounts = oldAccs.filter((el) => el.id !== id);
    this.storage.commit();
    this.eventDbUpdate();
  }
  editAccName(id, name) {
    const accs = this.root.accounts.map((el) => {
      if (el.id === id) el.name = name;
      return el;
    });
    this.root.accounts = accs;
    this.storage.commit();
    this.eventDbUpdate();
  }
  selectAccount(id) {
    const accs = this.getAllAccs().map((el) => {
      if (el.id == id) el.selected = true;
      else el.selected = false;
      return el;
    });
    this.root.accounts = this.#unshiftSelected(accs);
    this.storage.commit();
    this.eventDbUpdate();
  }
  setAppMode(label) {
    this.root.appSettings.appMode = label;
    this.storage.commit();
  }
  getAppMode() {
    return this.root.appSettings.appMode;
  }
  /**
   *
   * @returns {wowPaths}
   */
  getAppSettings() {
    return this.root.paths.find(el=>el.selected);
  }
  setWotlkRealmlist(realmPath) {
    this.root.appSettings.wotlkRealmlist = realmPath;
    this.storage.commit();
  }
  /**
   *
   * @param {"wotlkFolderPath" | "tbcFolderPath"} mode tbcFolderPath | wotlkFolderPath
   * @param {string} path wow folder path
   */
  setWoWPath(mode, path = '') {
    this.root.appSettings[mode] = path;
    this.storage.commit();
  }

  eventDbUpdate() {
    document.post(
      new Event('db-update', {
        bubbles: true,
        data: this,
      }),
    );
  }
  //TODO add default null values for realm config or in form 
  addWowPaths({ exePath, realmPath, wowId,configPath }) {
    const selected = this.getWowPaths().length === 0;
    this.root.paths.unshift({
      exePath,
      realmPath,
      configPath,
      wowId,
      id: Sciter.uuid(),
      selected,
    });

    this.storage.commit();
    this.eventDbUpdate();
  }
  getWowPaths() {
    return this.root.paths;
  }
  getWowPathsById(id) {
    return this.root.paths.find((el) => el.id == id);
  }
  selectWowPath(id) {
    const newPaths = this.getWowPaths().map((el) => {
      if (el.id == id) el.selected = true;
      else el.selected = false;
      return el;
    });
    this.root.paths = this.#unshiftSelected(newPaths);
    this.storage.commit();
    this.eventDbUpdate();
  }
  updateWowPaths(id, { exePath, realmPath, wowId, configPath }) {

    const paths = this.root.paths.map((el) => {
      if (el.id == id) {
        el.exePath = exePath;
        el.realmPath = realmPath;
        el.wowId = wowId;
        el.configPath = configPath;
      }
      return el;
    });
    this.root.paths = paths;
    this.storage.commit();
    this.eventDbUpdate();
  }
  deleteWowPaths(id) {
    const paths = this.root.paths.filter((el) => el.id != id);
    this.root.paths = paths;
    this.storage.commit();
    this.eventDbUpdate();
  }

  /**
   *
   * this will put selected from select list on index 0
   */
  #unshiftSelected(arr) {
    const myArr = [...arr];
    for (let i = 0; i < myArr.length; i++) {
      if (myArr[i].selected) {
        const item = myArr[i];
        myArr.splice(i, 1);
        myArr.unshift(item);
        break;
      }
    }

    return myArr;
  }
}


