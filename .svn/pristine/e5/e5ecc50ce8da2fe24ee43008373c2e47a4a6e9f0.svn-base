/**
 * @Author:      zhanghq
 * @DateTime:    2018-01-08 09:06:03
 * @Description: 饼图
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2018-01-08 09:06:03
 */

import zrender from 'zrender'
import d3 from 'd3'
import _ from 'lodash'
import { InitZr } from '../../util/initZr'
import { Pie } from '../../util/shapes'
import { showTips, hideTips } from './tips.js'
 
export default class BasePie {

  /**
   * 图表默认配置项
   * @return {object} 默认配置项
   */
  defaultSetting () {
    return{
      width: 300,
      height: 300,
      itemStyle: {
        width: 15,
        radius: 10,
        colors: ['#3ed5de', '#ffce10', '#00eeeb', '#3ed5de', '#ffce10', '#00eeeb'],
        padding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }
      }
    }  
  }

  /**
   * Creates an instance of BasePie
   * @param {string} selector 容器元素选择器
   * @param {object} opt 图表组件配置项
   */
  constructor(selector, opt) {
    this.selector = selector
    const defaultSetting = this.defaultSetting()
    this.config = _.merge({}, defaultSetting, opt)
    const { width, height } = this.config
    this.zr = new InitZr(selector, width, height)
    // 创建饼图布局  
    this.pie = d3.layout.pie().sort(null) 
      .value((d) => d.value)
  }

  render(data) {
    const self = this
    // 转换数据  
    let pieData = self.pie(data)  
    self.setPieAttribute(pieData)
  }

  setPieAttribute(data) {
    const self = this
    const { width, height } = self.config
    const arcG = new zrender.Group()
    arcG.position = [width / 2, height / 2]
    data.map((d, i) => {
      let arc = new Pie({
        shape: {
          cx: 0,
          cy: 0,
          innerRadius: 60,
          outerRadius: 90,
          startAngle: d.startAngle,
          endAngle: d.endAngle
        },
        style: {
          fill: self.getColor(i) || '#ffce10'
        }
      })
      // 添加元素到组
      arcG.add(arc)
      // 鼠标移动事件
      arc
        .on('mousemove', evt => {
          let posi = {
            x: evt.offsetX,
            y: evt.offsetY - 90
          }
          showTips(self.selector, d.data, posi)
          self.zr.addHover(arc, {
            innerRadius: 60,
            outerRadius: 120,
            fill: 'yellow'
          })
        })
        .on('mouseout', () =>{ 
          // 移出高亮元素
          self.zr.removeHover(arc)
          hideTips(self.selector)
        })
    })
    self.zr.add(arcG)
 
  }

  /**
   *  获取饼图填充色
   *  @param    {numbter}  idx [下标]
   *  @return   {void}
   */
  getColor(idx) {
    // 默认颜色
    const defauleColor = [
      '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
      '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
      '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
      '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
    ]
    let palette = _.merge([], defauleColor, this.config.itemStyle.colors)
    return palette[idx % palette.length]  
  } 
}

