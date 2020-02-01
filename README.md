# OnPage App - Core Module


## Install:
```bash
# If you use yarn
yarn add https://github.com/gufoe/op-core.git
# If you use npm
npm i -s https://github.com/gufoe/op-core.git
```

In your main.js file:
```js
Vue.use(op, {
  api: 'https://YOUR-DOMAIN.onpage.it/api/',
  token: 'YOUR-APP-TOKEN',
})
```

In your App.vue file:
```js
export default {
    // ...
    data () {
        return {
            $op: this.$op,
            // ...
        }
    },
    
    created () {
        $op.checkUpdates()
    }
    // ...
}
```

You will now be able to access your data at `$op.data` and `$op.db`.

