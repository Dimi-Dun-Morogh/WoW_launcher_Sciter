import * as env from '@env'
import * as sys from "@sys";
import {encode, decode} from "@sciter";

export class Wow {
  static launchWow(path) {
    env.exec(path)
  }

  static async realmlistChange(path, realmlist) {
    if(!realmlist) return;
    const realmlistpath =  `${this.checkForSlash(path)}`;
    const file = sys.fs.openSync(realmlistpath, 'w');
    const buffer = encode(realmlist, "utf-8")
    await file.write(buffer);
    await file.close()
  }

  static async addAccLogin(path, login) {
    if(!login) return;
    const settingsPath = `${this.checkForSlash(path)}`;
    const file = await sys.fs.open(settingsPath, 'as+');
    const arrayBuffer = await file.read()
    const decoded = decode(arrayBuffer, "utf-8");
    // SET accountName
    const res = decoded.split('\n').filter(el=>!el.includes("SET accountName")).join("\n")+`\nSET accountName ${login}`;
    await file.write(encode(res));
    await file.close()
  }
  static checkForSlash(str) {
    if(str[str.length-1] ===  "\\") return str.slice(0,str.length-1)
    return str
  }
}


