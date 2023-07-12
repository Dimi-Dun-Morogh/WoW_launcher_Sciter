import * as env from '@env'
import * as sys from "@sys";
import {encode, decode} from "@sciter";

export class Wow {
  static launchWow(path) {
    const exepath = path+`\/Wow.exe`;
    env.exec(exepath)
  }

  static async realmlistChange(path, realmlist) {
    if(!realmlist) return;
    const realmlistpath =  `${path}\/realmlist.wtf`;
    const file = sys.fs.openSync(realmlistpath, 'w');
    const buffer = encode(realmlist, "utf-8")
    await file.write(buffer);
    await file.close()
  }

  static async addAccLogin(path, login) {
    if(!login) return;
    const settingsPath = `${path}\\WTF\\Config.wtf`;
    const file = await sys.fs.open(settingsPath, 'as+');
    const arrayBuffer = await file.read()
    const decoded = decode(arrayBuffer, "utf-8");
    // SET accountName
    const res = decoded.split('\n').filter(el=>!el.includes("SET accountName")).join("\n")+`SET accountName ${login}`;
    await file.write(encode(res));
    await file.close()
  }
}

