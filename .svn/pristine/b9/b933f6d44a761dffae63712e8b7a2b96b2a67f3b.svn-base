/*
 * @Author: zhanghongqiao@hiynn.com 
 * @Date: 2018-01-22 08:55:27 
 * @Description: 弧形图
 * @Last Modified by: zhanghongqiao@hiynn.com
 * @Last Modified time: 2018-01-22 10:55:10
 */
 
import _ from 'lodash'
import { InitZr } from '../../util/initZr'
import { CountMargin } from '../../util/util'
import { YAxis } from '../../util/axis'
import XAxis from './xAxis'
import { TrigonBar } from '../../util/shapes'

export default class ArcCharts {
  /**
   * 图表默认配置项
   * @return {object} 默认配置项
   */
  defaultSetting () {
    return{
      width: 600,
      height: 300,
      itemStyle: {
        width: 15,
        radius: 10,
        fill: '#3ed5de',
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        colors: [
          {
            color: ['#d103ca', '#49aefe']
          }, {
            color: ['#fb16b8', '#49aefe']
          }, {
            color: ['#9936e8', '#49aefe']
          }
        ]
      },
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
      }
    }  
  }
  /**
   * Creates an instance of Heatmap
   * @param {string} selector 容器元素选择器
   * @param {object} opt 图表组件配置项
   */
  constructor(selector, opt) {
    this.selector = selector
    const defaultSetting = this.defaultSetting()
    this.config = _.merge({}, defaultSetting, opt)
    let margin = new CountMargin(this.config)
    this.config = _.merge({}, this.config, margin)
    const { width, height } = this.config
    this.zr = new InitZr(selector, width, height)
    // 实例化Y轴
    this.yAxis = new YAxis(this.zr, this.config)
    // 实例化X轴
    this.xAxis = new XAxis(this.zr, this.config)
  }

  /**
   *  渲染
   *  @example: [
   *    {
   *     'name': '@cname', // 名称
   *     'value|1-1000': 1 // 数值
   *   }
   *  ]
   *  @param    {array}  data 图表数据
   *  @return   {void}  void
   */
  render(data) {
    let dataset = []
    data.map(d => dataset.push(d.value))
    // 渲染X轴
    this.xScale = this.xAxis.render(data)
    // 渲染Y轴
    this.yScale = this.yAxis.render(dataset)
    this.setPolygonAttribute(dataset)
  }

  /**
   * 
   * @param {array} data 
   */

  setPolygonAttribute(data) {
    const { margin, height, xWidth } = this.config
    const { left, top } = margin
    
    data.map((d, i) => {
      let width = xWidth / data.length
      let bezierCurve = new TrigonBar({
        shape: {
          x: this.xScale(i) + left,
          y: height - this.yScale(d) - top,
          width: width,
          height: this.yScale(d)
        },
        style: {
          fill: '#12b5e0'
        }
      })
      this.zr.add(bezierCurve)
    })
  }
}
