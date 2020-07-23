import pako from 'pako'
import './json-lib.js'
import { Plugins, FilesystemDirectory } from '@capacitor/core'
const { Device } = Plugins
const { Filesystem } = Plugins

// import wasm from './json-rs/json_rs_bg.wasm'
//
// console.log('wasm', wasm)
// window.wasm = wasm
// wasm({ }).then(({ instance }) => {
//   console.log('finish', instance)
//   console.log(instance.exports.main())
// })

if (!Array.prototype.flat) {
Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
    }
})
}

export default {

  parse_json(str) {
    try {
      return JsonLib.parse(str)
      // return JSON.parse(str)
    } catch (e) {
      console.log('Native JSON parse failed, using json lib', e)
    }
  },



  isInApp () {
    return typeof cordova != 'undefined'
  },





  store (name, obj) {
    // console.log('stringifying object...')
    // console.time('stringify')
    // obj = JsonLib.stringify(obj)
    // console.timeLog('stringify')
    // console.log('compressing object from ', obj.length, 'bytes...')
    // console.time('deflate')
    var info = Device.getInfo()

    info.then(function(result) {
      //se sono dentro web carico nel local storage
      if (result.platform == 'web'){
        obj = pako.deflate(obj, { to: 'string' })
        localStorage.setItem(name, obj)
      } else
      if(result.platform == 'android' || result.platform == "ios"){
        Filesystem.writeFile({
          path: 'file.json',
          data: JSON.stringify(obj),
          directory: FilesystemDirectory.Data,
          encoding: FilesystemEncoding.UTF8
        })
      }
      console.log(result) // "Stuff worked!"
    }, function(err) {
      console.log(err) // Error: "It broke"
    })
  },

  load (name, on_finish) {
    console.time('getItem before')
    setTimeout(() => {
      // console.log('get item')
      let obj = localStorage.getItem(name)
      // console.log('get item ok:', obj ? obj.length : 'nessun dato')
      // console.timeLog('getItem')
      if (!obj) return on_finish(null)
      try {
        console.time('inflate')
        // console.log('decompressing', obj.length, 'bytes...')
        obj = pako.inflate(obj, { to: 'string' })
        console.timeEnd('inflate')
        // console.log('parsing resulting', obj.length, 'bytes...')
        console.time('parse')
        obj = this.parse_json(obj)
        console.timeLog('parse')
        // console.log('finish')
        on_finish(obj)
      } catch (e) {
        console.error('error', e)
        on_finish(null)
      }
    }, 10)





  },

  waitCordova(func) {
    if (!this.isInApp() || window.is_cordova_ready) {
      func()
    } else {
      document.addEventListener('deviceready', func)
    }
  }
}
