/*
 * @Author: zhanghongqiao@hiynn.com 
 * @Date: 2018-01-20 18:03:23 
 * @Description: 三角形渐变图
 * @Last Modified by: zhanghongqiao@hiynn.com
 * @Last Modified time: 2018-01-22 10:55:48
 */

import zrender from 'zrender'
import _ from 'lodash'
import { InitZr } from '../../util/initZr'
import { CountMargin, modifyAlpha } from '../../util/util'
import { YAxis, XAxis } from '../../util/axis'
 
export default class TriangleArea {
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
          left: 10
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
    // polygon group
    this.polygonGroup = new zrender.Group()
    // circle group
    this.circleGroup = new zrender.Group()
    // 创建渐变
    this.createGradient()
    
  }

  /**
   *  创建渐变
   *  @return   {void}  void
   */
  createGradient() {
    this.gradient = []
    
    const colors = this.getColor()
    colors.map((d) => {
      let gra = new zrender.LinearGradient(0.2, 0, 0.2, 1, [
        {
          offset: 0,
          color: d.color[0]
        }, {
          offset: 1,
          color: modifyAlpha(d.color[1], 0.2) 
        }
      ])
      this.gradient.push(gra)
    })
  }

  /**
   * 
   * @param {array} data 
   */
  
  render(data) {
    // 获取value值
    let dataset = []
    data.map(d => dataset.push(d.value))
    // 渲染X轴
    this.xScale = this.xAxis.render(data)
    // 渲染Y轴
    this.yScale = this.yAxis.render(dataset)
    this.setpolygonAttribute(dataset)
    // 画圆
    this.setCircleAttribute(data)
  }
 
  /**
   * @param {array} data 
   */

  setpolygonAttribute(data) {
    const { margin, xWidth, height } = this.config
    const { left, bottom } = margin
    data.map((d, i) => {

      let points = [[left, height - bottom], 
        [this.xScale(i) + left, this.yScale(d)], 
        [xWidth, height - bottom]]
      let polygon = new zrender.Polygon({
        style: {
          fill: this.gradient[i]
        }
      })
      polygon.animateTo({
        shape: {
          points: points
        }
      }, 5000)
      this.polygonGroup.add(polygon)
    })
    this.zr.add(this.polygonGroup)
  }

  /**
   * 
   * 小圆点
   * @param {any} data 
   */

  setCircleAttribute(data) {
    const { left } = this.config.margin
    data.map((d, i) => {
      let circle = new zrender.Circle({
        shape: {
          r: 5,
          cx: this.xScale(i) + left,
          cy: this.yScale(d.value) + 2
        },
        style: {
          fill: '#00ebd8',
          stroke: modifyAlpha('white', 0.5), 
          lineWidth: 2
        }
      })
      this.circleGroup.add(circle)
    })
    this.zr.add(this.circleGroup)
  }

  getColor(idx) {
    // 默认颜色
    const defauleColor = [
      {
        color: ['#aa58fd', '#008efe']
      }, {
        color: ['#191ed4', '#9936e8']
      }, {
        color: ['#50adfc', '#008efe']
      }, {
        color: ['#50adfc', '#008efe']
      }, {
        color: ['#84f088', '#008efe']
      }, {
        color: ['#f97dcb', '#008efe']
      }, {
        color: ['#f0f88b', '#008efe']
      }, {
        color: ['#7bfcfb', '#008efe']
      }, {
        color: ['#7bfcfb', '#008efe']
      }, {
        color: ['#aa58fd', '#008efe']
      }, {
        color: ['#aa58fd', '#008efe']
      }, {
        color: ['#aa58fd', '#008efe']
      }, {
        color: ['#aa58fd', '#008efe']
      }
    ]
    let palette = _.merge([], defauleColor, this.config.itemStyle.colors)
    return idx === undefined ? palette : palette[idx % palette.length]  
  }  
}
