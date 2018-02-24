/**
 * @Author:      zhanghq
 * @DateTime:    2018-01-13 15:24:21
 * @Description: 图例 
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2018-01-13 15:24:21
 */
import $ from 'jquery'
import hbs from './hbs/legend.hbs'

export default class Legend {
  constructor(selector, data, charts) {
    this.charts = charts
    this.selector = selector
    $(selector).append(hbs(data))
    // 事件绑定
    this.bindEvent()
  }
  bindEvent() {
    $(`${this.selector} .legend`).on('click', 'li', (evt) => {
      const $this = $(evt.target)
      let isClass = $this.hasClass('invalid')
      if(isClass){
        $this.removeClass('invalid')
      }else{
        $this.addClass('invalid')
      }
      let index = $this.index()
      // 拆线
      let line = this.charts.polyline
      let circleG = this.charts.circleGroup
      let rectG1 = this.charts.rectGroup[0]
      let rectG2 = this.charts.rectGroup[1]
      switch(index){
      case 0: // 趋势
        if(!isClass){
          line.animateTo({
            style: {
              opacity: 0
            }
          })
          circleG.eachChild((circle) => {
            circle.animateTo({
              style: {
                opacity: 0
              }
            })
          })
        }else{
          line.animateTo({
            style: {
              opacity: 1
            }
          })
          circleG.eachChild(circle => {
            circle.animateTo({
              style: {
                opacity: 1
              }
            })
          })
        }
        break
      case 1: // 同比
        this.toggle(isClass, rectG1, rectG2, 1)
        break
      case 2: // 环比
        this.toggle(isClass, rectG2, rectG1, 2)  
        break
      default:
        break
      }
    })
  }   
  /**
   * 数据组显示隐藏
   * @param {boolean} status 当前状态，显示/隐藏
   * @param {object} rectG1  第一组矩形
   * @param {object} rectG2  第二组矩形
   * @param {number} type  类型(同比、环比)
   * @return   {void}  void
   */
  toggle(status, rectG1, rectG2, type) {
    if(status){
      rectG1.eachChild(rect => {
        rect.animateTo({
          style: {
            opacity: 1
          }
        })
      })
      rectG2.eachChild(rect => {
        let x2 = 0
        type === 1 ? x2 = rect.shape.x + rect.shape.width / 2 : x2 = rect.shape.x
        rect.animateTo({
          shape: {
            x: x2,
            width: rect.shape.width / 2
          }
        })
      })
    }else{
      rectG1.eachChild(rect => {
        rect.animateTo({
          style: {
            opacity: 0
          }
        })
      })
      rectG2.eachChild(rect => {
        let x = 0
        type === 1 ? x = rect.shape.x - rect.shape.width : x = rect.shape.x
        rect.animateTo({
          shape: {
            x: x,
            width: rect.shape.width * 2
          }
        })
      })
    }
  }
}
