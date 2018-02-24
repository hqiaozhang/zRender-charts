/**
 * @Author:      zhanghq
 * @DateTime:    2018-01-11 15:55:16
 * @Description: y轴
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2018-01-11 15:55:16
 */

import d3 from 'd3'
import zrender from 'zrender'
import _ from 'lodash'

export default class YAxis { 
  defaultSetting() {
    return {
      // y轴配置项
      yAxis: { 
        rectItem: {
          width: 100, 
          height: 28,
          fill: '#1b1b50',
          stroke: '#493aa8',
          r: [6, 6, 6, 6],
          lineWidth: 1,
          opacity: 0.8
        },
        // y轴线条配置项
        axisLine: {
          stroke: '#496d96'
        },
        // 文字配置
        label: { 
          color: '#fff',
          fontSize: 16,
          textAlign: 'start',
          y: 6
        },
        // 刻度线配置
        axisTick: {
          color: '#454c72'
        },
        min: 0,
        format: '', // 格式化
        ticks: 5 // y轴坐标刻度
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
  }

  /**
   *  渲染
   *  @param    {array}  data 图表数据
   *  @return   {function}   y轴坐标
   */
  render(data) {
    const { margin, yHeight, yAxis } = this.config
    const { top } = margin
    const { height: rectH } = yAxis.rectItem
    // 实例化一个组，存储线条和名字 
    this.axisG = new zrender.Group()
    // 刻度从0向上自增，坐标从底部开始
    this.axisG.position = [0, top]
 
    // y轴比例尺
    this.yScale = d3.scale.linear()
      .domain([0, data.length - 1])
      .range([0, yHeight - rectH])
    // 渲染轴线
    this.axisLine()  
    // 渲染文字
    this.axisLabel(data)
    // 渲染刻度线
    this.axisRect(data)
    // 添加
    this.zr.add(this.axisG)
    return this.yScale
  }
 
  /**
   *  画y轴线
   *  @return   {void}  void
   */
  axisLine() {
    const { yHeight, yAxis, margin } = this.config
    const { rectItem, axisLine } = yAxis
    const { left } = margin
    const line = new zrender.Line({
      shape: {
        x1: rectItem.width + left,
        x2: rectItem.width + left,
        y1: 0,
        y2: yHeight
      },
      style: {
        stroke: axisLine.stroke
      }
    })
    this.axisG.add(line)  
  }

  /**
   *  文本背景
   *  @return   {void}  void  
   */
  axisRect(data) {
    const { dur, yAxis } = this.config
    const { rectItem } = yAxis
    let rectG = new zrender.Group() // 创建一个组
    data.map((d, i) => {
      // 实例化刻度线
      const rect = new zrender.Rect({
        shape: {
          width: rectItem.width,
          height: rectItem.height,
          r: rectItem.r,
          x: 0,
          y: this.yScale(i)
        },
        style: {
          fill: rectItem.fill,
          stroke: rectItem.stroke,
          lineWidth: rectItem.lineWidth,
          opacity: 0
        } 
      })
      // 设置过渡动画
      rect.animateTo({
        style: {
          opacity: 1
        }
      }, dur)
      rectG.add(rect)
    })
    // 添加到组元素
    this.axisG.add(rectG)
  }

  /**
   * 添加y轴文字
   * @param {array} data   数据
   * @return   {void}  
   */
  axisLabel(data) {
    // 创建y轴文字
    const { label } = this.config.yAxis
    let textsG = new zrender.Group()
    // 比例刻度计算
    data.map((d, i) => {
      // 实例化文字
      const text = new zrender.Text({
        z: 1,
        cursor: 'default',
        style: {
          text: d.name,
          textAlign: label.textAlign,
          y: this.yScale(i) + label.y,
          x: 12,
          textFill: label.color,
          opacity: 0,
          fontSize: label.fontSize
        }
      })
      text.animateTo({
        style: {
          opacity: 1
        }
      }, 400)
      textsG.add(text)
    })
    // 添加到组元素
    this.axisG.add(textsG)
  }
}
