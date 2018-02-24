/**
 * @Author:      zhanghq
 * @DateTime:    2018-01-11 15:55:16
 * @Description: 添加Y轴
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2018-01-11 15:55:16
 */

import d3 from 'd3'
import zrender from 'zrender'
import _ from 'lodash'
import { CountMargin } from '../util'

export default class YAxis { 
  defaultSetting() {
    return {
      // y轴配置项
      yAxis: { 
        position: 'left', // y 轴的位置(left, right)
        // 文字配置
        label: { 
          color: '#fff',
          fontSize: 12,
          textAlign: 'end'
        },
        // 刻度线配置
        axisTick: {
          color: '#454c72'
        },
        min: 0,
        format: '', // 格式化
        ticks: 5 // y轴坐标刻度
      },
      // canvas四周需要预留位置，用于显示X、Y轴
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
      }
    }
  }
  /**
   * 实例化
   * @param {Object} zr     zrender 实例对象
   * @param {Object} opt  配置项
   */
  constructor(zr, opt) {
    this.zr = zr
    // 获取配置项
    const defaultSetting = this.defaultSetting()
    this.config = _.merge({}, defaultSetting, opt)
    let margin = new CountMargin(this.config)
    this.config = _.merge({}, this.config, margin)
  }

  /**
   *  渲染
   *  @param    {array}  data 图表数据
   *  @return   {function}   y轴坐标
   */
  render(data) {
    const { xWidth, height, margin, yAxis, yHeight } = this.config
    const { bottom, left } = margin
    // 实例化一个组，存储线条和刻度  
    this.axisG = new zrender.Group()
    // 刻度从0向上自增，坐标从底部开始
    const { position } = yAxis
    if(position === 'left'){
      this.axisG.position = [0, height - bottom]
    }else{
      this.axisG.position = [xWidth - left, height - bottom]
    }

    // 求最大值
    this.max = this.formatMax(data)
    // y轴比例尺
    this.yScale = d3.scale.linear()
      .domain([0, this.max * 1.01])
      .range([0, yHeight])
    // 渲染轴线
    this.axisLine()  
    // 渲染文字
    this.axisLabel(data)
    // 渲染刻度线
    this.axisTick()
    // 添加
    this.zr.add(this.axisG)
    return this.yScale
  }

  /**
   *  求最大值
   *  @example: [10, 15, 5, 20, 50]
   *  @param    {array}  data 数据
   *  @return   {number}  最大值
   */
  formatMax(data) {
    const { ticks } = this.config.yAxis
    let max = d3.max(data)
    if(max < 10) {
      return max
    }
    // 求最小公倍数
    let minValue = max % (10 * ticks)
    max = max - minValue + 10 * ticks
    return max
  }
 
  /**
   *  画y轴线
   *  @return   {void}  void
   */
  axisLine() {
    const { yHeight, margin } = this.config
    const { left } = margin
    const line = new zrender.Line({
      shape: {
        x1: left,
        x2: left,
        y1: 0,
        y2: -yHeight 
      },
      style: {
        stroke: '#454c72'
      }
    })
    this.axisG.add(line)  
  }

  /**
   *  刻度线
   *  @return   {void}  void  
   */
  axisTick() {
    const { ticks, axisTick, position } = this.config.yAxis
    const { yHeight, margin } = this.config
    const { left } = margin
    let linesG = new zrender.Group() // 创建一个组
    for(let i = 0; i <= ticks; i++) {
      // 实例化刻度线
      const line = new zrender.Line({
        shape: {
          x1: left,
          x2: position === 'left' ? left - 10 : left + 10,
          y1: -yHeight / ticks * i,
          y2: -yHeight / ticks * i
        },
        style: {
          stroke: axisTick.color
        }
      })
      linesG.add(line)
    }
    // 添加到组元素
    this.axisG.add(linesG)
  }

  /**
   * 添加y轴文字
   * @param {array} data   数据
   * @return   {void}  
   */
  axisLabel() {
    const { yHeight, margin } = this.config
    // 创建y轴文字
    const { ticks, label, min, position, format } = this.config.yAxis
    let textsG = new zrender.Group()
    textsG.position[0] = position === 'left' ? 0 : margin.right + 15
    let max = this.max
    // 比例刻度计算
    for(let i = 0; i <= ticks; i++) {
      let value = (max - min) / ticks
      let range = min + i * value
      // 实例化文字
      const text = new zrender.Text({
        cursor: 'default',
        style: {
          text: Math.round(range) + format,
          textAlign: label.textAlign,
          y: -yHeight / ticks * i - 6,
          x: 0,
          textFill: label.color,
          opacity: 0
        }
      })
      text.animateTo({
        style: {
          opacity: 1
        }
      }, 400)
      textsG.add(text)
    }
    // 添加到组元素
    this.axisG.add(textsG)
  }
}
