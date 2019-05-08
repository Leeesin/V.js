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
    this.allDirective = this.genDirectiveObj()
    // this._data.xxx = 111111
  }

  observe(obj, cb) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key], cb.bind(this))
    })
  }


  notify(key, newValue) {//拿到更新的 key 和 value
    // const allDirective = this.genDirectiveObj()
    const deps = this.allDirective[key] //需要更新的节点
    if (!deps) return
    deps.forEach(item => {
      item.update(newValue)
    })
  }

  genDirectiveObj() {//获取带有指令的节点 生成指令信息的对象集合   
    const directives = '[v-text],[v-model],[v-show],[v-click]'
    var els = document.querySelectorAll(directives)
    var c = Array.from(els)
    var directiveMap = {}
    c.forEach(item => {
      const defaultDisplay = window.getComputedStyle(item).display  //元素默认的 display
      var c2 = Array.from(item.attributes)
      c2.forEach(item2 => {
        if (item2.name === 'v-click') { //如果是事件
          item.addEventListener('click', this._methods[item2.value].bind(this._data))
        }

        if (item2.name === 'v-text') {
          if (this._data[item2.value] === undefined) {
            console.error('模板内的变量必须在data内申明！')
          } else {
            item.innerHTML = this._data[item2.value]
          }
        }

        if (item2.name === 'v-show') {
          if (this._data[item2.value] === undefined) {
            console.error('模板内的变量必须在data内申明！')
          } else {
            if (this._data[item2.value]) {
              if (defaultDisplay === 'block') item.style.display = defaultDisplay
              if (defaultDisplay === 'inline-block') item.style.display = defaultDisplay
              if (defaultDisplay === 'inline') item.style.display = defaultDisplay
            }
            else {
              item.style.display = 'none'
            }
          }
        }

        const isDirective = directives.match(item2.name) //是否是指令属性 
        if (isDirective) {
          directiveMap[item2.value] = []
          directiveMap[item2.value].push({
            defaultDisplay,
            el: item,
            directiveName: item2.name,
            update(newValue) {
              if (this.directiveName === 'v-text') {
                this.el.innerHTML = newValue
              }
              if (this.directiveName === 'v-model') {
                this.el.value = newValue
              }
              if (this.directiveName === 'v-show') {
                console.log(11111);

                if (newValue) {
                  if (this.defaultDisplay === 'block') this.el.style.display = this.defaultDisplay
                  if (this.defaultDisplay === 'inline-block') this.el.style.display = this.defaultDisplay
                  if (this.defaultDisplay === 'inline') this.el.style.display = this.defaultDisplay
                } else {
                  this.el.style.display = 'none'
                }
              }

            }
          })

        }
      })
    })
    return directiveMap
  }
}
