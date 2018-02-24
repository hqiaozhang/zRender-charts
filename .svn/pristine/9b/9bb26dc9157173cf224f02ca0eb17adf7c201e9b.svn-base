/*
 * @Author: zhanghongqiao@hiynn.com 
 * @Date: 2018-01-18 09:43:02 
 * @Description: 数据更新
 * @Last Modified by: zhanghongqiao@hiynn.com
 * @Last Modified time: 2018-01-20 16:59:31
 */

import zrender from 'zrender'
 
export default class Tools {
  constructor() {
    this.nameNS = null
  }
  data(value) {
    this._data_ = value
    return this
  }

  select(selector) {
    this.group = new zrender.Group()
    selector.add(this.group)
    return this
  }

  attr(nameNS) {
    this.group.eachChild((shape) => {
      shape.attr(nameNS())
    })
    return this.group
  }

  append(shape) {
    // 首字母转换为大写，用于实例化
    let instanceName = shape[0].toUpperCase() + shape.slice(1)
    this._data_.map(() => {
      // 实例化形状
      // shape = new zrender[instanceName]()
      this.group.add(new zrender[instanceName]())
    })
    return this
  }
}
 
