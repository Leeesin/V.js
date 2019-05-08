function defineReactive(obj, key, val, cb) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      return val;
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      val = newVal;
      cb(key, newVal);
    }
  });
}


class V {
  constructor({ data = {}, methods = {} }) {
    this._data = data
    this._methods = methods
    this.observe(this._data, this.notify)

    this._data.xxx2 = '222'
    // setTimeout(() => {
    //   this._data.xxx2 = '333333333'
    // }, 1000);
  }

  observe(obj, cb) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key], cb.bind(this))
    })
  }


  notify(key, newValue) {//拿到更新的 key 和 value
    const allDirective = this.genDirectiveObj()
    const deps = allDirective[key] //需要更新的节点
    if (!deps) return
    deps.forEach(item => {
      item.update(newValue)
    })
  }


  genDirectiveObj(params) {//获取带有指令的节点 生成指令信息的对象集合   
    const directives = '[v-text],[v-model],[v-show],[v-click]'
    var els = document.querySelectorAll(directives)
    var c = Array.from(els)
    var directiveMap = {}
    c.forEach(item => {
      var c2 = Array.from(item.attributes)
      c2.forEach(item2 => {
        console.log('item2.name 的值是：', item2.name);
        if (item2.name === 'v-click') { //如果是事件

          item.addEventListener('click', this._methods[item2.value].bind(this._data))

        }
        const isDirective = directives.match(item2.name) //是否是指令属性 
        if (isDirective) {


          directiveMap[item2.value] = []
          directiveMap[item2.value].push({
            el: item,
            directiveName: item2.name,
            update(newValue) {
              if (this.directiveName === 'v-text') {
                this.el.innerHTML = newValue
              }
              if (this.directiveName === 'v-model') {
                this.el.value = newValue
              }
            }
          })
        }
      })
    })
    return directiveMap

    console.log('els 的值是：', els);
    console.log(' c 的值是：', c);
    console.log('directiveMap 的值是：', directiveMap);

  }


}
