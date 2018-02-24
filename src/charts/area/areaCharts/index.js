/*
 * @Author: zhanghongqiao@hiynn.com 
 * @Date: 2018-01-18 17:13:50 
 * @Description: 面积图
 * @Last Modified by: zhanghongqiao@hiynn.com
 * @Last Modified time: 2018-01-22 08:53:33
 */

import zrender from 'zrender'
import _ from 'lodash'
import { InitZr } from '../../util/initZr'
import { YAxis, XAxis } from '../../util/axis'
import { CountMargin } from '../../util/util'
import { showTips, hideTips } from './tips.js'
import Tools from '../../util/tools'
const tools = new Tools()

export default class AreaCharts {
  defaultSetting() {
    return {
      width: 500,
      height: 300,
      itemStyle: {
        width: 15,
        radius: 10,
        normal: {
          fill: [{
            color: ['#9f109c', 'rgba(159, 16, 156, 0.2)']
          }]
        },
        icon: {
          fill: '#dff02e',
          stroke: 'rgba(223, 240, 46, 0.4)',
          radius: 5,
          lineWidth: 8
        },
        emphasis: {
          fill: [{
            color: ['#021f3d', '#c61cea']
          }]
        },
        // 图形离X、Y轴的距离
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 5
        }
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
  
  constructor(selector, opt) {
    this.selector = selector
    this.config = _.merge({}, this.defaultSetting(), opt)
    const { width, height } = this.config
    let margin = new CountMargin(this.config)
    this.config = _.merge({}, this.config, margin)
    this.zr = new InitZr(selector, width, height)
    // 实例化Y轴 
    this.yAxis = new YAxis(this.zr, this.config)
    // 实例化X轴
    this.xAxis = new XAxis(this.zr, this.config)
    // 创建渐变
    this.createGradient()
  }
  /**
   *  创建渐变
   *  @return   {void}  void
   */
  createGradient() {
    const { normal, emphasis } = this.config.itemStyle
    let fill = [...normal.fill, ...emphasis.fill]
    this.gradient = []
    fill.map(d => {
      let gra = new zrender.LinearGradient(0.2, 0, 0.2, 1, [
        {
          offset: 0,
          color: d.color[0]
        }, {
          offset: 1,
          color: d.color[1]
        }
      ])
      this.gradient.push(gra)
    })
  }

  /**
   * 渲染
   * @param {array} data 图表数据 
   * @return   {void}  void
   */
  render(data) {
    let dataset = []
    data.map(d => {
      dataset.push(d.value)
    })
    this.xScale = this.xAxis.render(data)
    this.yScale = this.yAxis.render(dataset)
    this.setAttributePolygon(dataset)
    this.setCircleAttribute(data)
  }

  setAttributePolygon(data) {
    const { yHeight, xWidth, margin, grid } = this.config
   
    let polygonPoint = [[margin.left + grid.left, yHeight + margin.bottom]]
    data.map((d, i) => {
      let y = yHeight - this.yScale(d) + margin.bottom
      let x = this.xScale(i) + margin.left + grid.left
      polygonPoint.push([x, y])
    })
    polygonPoint.push([xWidth + grid.left, yHeight + margin.bottom])
    let polygon = new zrender.Polygon({
      shape: {
        points: polygonPoint,
        smoothConstraint: polygonPoint,
        smooth: 0.3
      },
      style: {
        fill: this.gradient[0]
        // stroke: '#1defc6'
      }
    }) 
    this.zr.add(polygon)
    // 实例化一条拆线
    let polyline = new zrender.Polyline({
      shape: {
        points: polygonPoint,
        smoothConstraint: polygonPoint,
        smooth: 0.3
      },
      style: {
        lineWidth: 2,
        fill: 'none',
        stroke: '#ff4d4b'
      }
    })
    this.zr.add(polyline)
  }

  setCircleAttribute(data) {
    const self = this
    const { itemStyle, margin, grid, height } = self.config
    const { icon } = itemStyle
    const { left } = margin
    let i = -1
    self.circleGroups = tools.select(self.zr)
      .data(data)
      .append('circle')
      .attr(() => {
        i++
        return {
          data: data[i],
          silent: false,
          shape: {
            r: icon.radius,
            cx: this.xScale(i), 
            cy: height - this.yScale(data[i].value)
          },
          style: {
            fill: icon.fill,
            stroke: icon.stroke,
            lineWidth: icon.lineWidth
          }
        }
      })
    self.circleGroups.eachChild((circle) => {
      circle.on('mousemove', (evt) => {
        let d = evt.target.data
        // 改变样式
        evt.target.attr({
          style: {
            fill: 'red'
          }
        })
        evt.target.animateTo({
          shape: {
            r: icon.radius + 4
          }
        }, 150)
        let posi = {
          x: evt.offsetX,
          y: evt.offsetY - 40
        }
        showTips(this.selector, d, posi)
      })
        .on('mouseout', (evt) => {
          // 改变样式
          evt.target.attr({
            style: {
              fill: icon.fill
            }
          })
          evt.target.animateTo({
            shape: {
              r: icon.radius  
            }
          }, 150)
          hideTips(this.selector)
        })
    })
    self.circleGroups.position = [left + grid.left, -margin.bottom]
    self.zr.add(self.circleGroups)
  }
}
