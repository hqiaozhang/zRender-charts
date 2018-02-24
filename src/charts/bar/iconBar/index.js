/**
 * @Author:      zhanghq
 * @DateTime:    2018-01-15 13:33:57
 * @Description: 右边添加小圆点柱状图
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2018-01-15 13:33:57
 */

import zrender from 'zrender'
import _ from 'lodash'
import { InitZr } from '../../util/initZr'
import { CountMargin } from '../../util/util'
import { YAxis, XAxis } from './axis/'
import { showTips, hideTips } from './tips.js'
import Tools from '../../util/tools'
const tools = new Tools()

export default class IconBar {
  /**
   * 图表默认配置项
   * @return {object} 默认配置项
   */
  defaultSetting () {
    return{
      width: 600,
      height: 400,
      dur: 500, // 动画过渡时间
      itemStyle: {
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        // 默认样式
        normal: {
          height: 6,
          lineWidth: 6,
          radius: 10,
          fill: [{
            color: ['#021f3d', '#1defc6']
          }, {
            color: ['rgba(2, 26, 54, 0.5)', 'rgba(29, 239, 198, 0.5)']
          }],
          icon: {
            fill: '#dff02e',
            stroke: 'rgba(223, 240, 46, 0.4)',
            radius: 5,
            lineWidth: 8
          }
        },
        // 高亮样式
        emphasis: {
          fill: [{
            color: ['#021f3d', '#c61cea']
          }, {
            color: ['rgba(2, 26, 54, 0.5)', 'rgba(229, 46, 240, 0.5)']
          }]
        }
        
      },
      yAxis: { 
        rectItem: {
          width: 100, 
          height: 28,
          fill: '#1b1b50',
          stroke: '#493aa8',
          r: [6, 6, 6, 6],
          lineWidth: 1,
          opacity: 0.8
        }
      },
      margin: {
        top: 20,
        right: 0,
        bottom: 30,
        left: 5
      }
    }  
  }
  /**
   * Creates an instance of RectBar
   * @param {string} selector 容器元素选择器
   * @param {object} opt 图表组件配置项
   */
  constructor(selector, opt) {
    // 获取配置项
    this.selector = selector
    const defaultSetting = this.defaultSetting()
    this.config = _.merge({}, defaultSetting, opt)
    const { width, height } = this.config
    let margin = new CountMargin(this.config)
    this.config = _.merge({}, this.config, margin)
    // 初始化zrender
    this.zr = new InitZr(selector, width, height)
    // 实例化Y轴 
    this.yAxis = new YAxis(this.zr, this.config)
    // 实例化X轴
    this.xAxis = new XAxis(this.zr, this.config)
    // 渐变创建
    this.createGradient()
    // 是否是初始化调用
    this.isInit = true   
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
      let gra = new zrender.LinearGradient(0, 0, 1, 1, [
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
    // this.zr.clear()
    this.yScale = this.yAxis.render(data)
    this.data = data
    let dataset = []
    data.map(d => dataset.push(d.value))
    this.xScale = this.xAxis.render(dataset)
    // 判断是否是初始化进来，调用实例化组
    if(this.isInit){
      this.initGroup(data)
    }
    // 画矩形
    this.setRectAttribute(dataset)
    // 画圆
    this.setCircleAttribute(dataset)
  }

  /**
   *  初始化组
   *  @param   {array}  data 图表数据
   *  @return  {void}  void
   */
  initGroup(data) {
    const self = this
    const { itemStyle, yAxis, margin } = self.config
    const { normal } = itemStyle
    const { top, left } = margin
    const { width: rectW, height: rectH } = yAxis.rectItem
    const { icon } = normal
    let i = -1
    // 矩形条组
    self.rectGroups = tools.select(self.zr)
      .data(data)
      .append('rect')
      .attr(() => {
        i++
        return {
          shape: {
            type: 'bar',
            height: normal.height,
            r: [0, 10, 10, 0],
            x: 0,
            y: self.yScale(i) + (rectH - normal.height) / 2
          },
          style: {
            fill: self.gradient[0],
            lineWidth: normal.lineWidth,
            stroke: self.gradient[1]
          }
        }
      })
    self.rectGroups.position = [rectW + left + normal.lineWidth, top]
    self.zr.add(self.rectGroups)

    i = -1
    self.circleGroups = tools.select(self.zr)
      .data(data)
      .append('circle')
      .attr(() => {
        i++
        return {
          silent: false,
          cursor: 'default',
          shape: {
            r: icon.radius,
            cx: 0,
            cy: this.yScale(i) + rectH - (icon.radius + icon.lineWidth)
          },
          style: {
            fill: icon.fill,
            stroke: icon.stroke,
            lineWidth: icon.lineWidth
          }
        }
      })
    self.circleGroups.position = [rectW + left + itemStyle.normal.lineWidth, top]
    self.zr.add(self.circleGroups)
    self.isInit = false
  }
 
  /**
   *  矩形属性设置
   *  @example: [example]
   *  @param    {[type]}  data [description]
   *  @return   {[type]}  [description]
   */
  setRectAttribute(data) {
    const { dur } = this.config
    let rectGroups = this.rectGroups
    rectGroups.eachChild((rect, i) => {
      rect
        // 设置过渡动画
        .animateTo({
          shape: {
            width: this.xScale(data[i]) - 5
          }
        }, dur)
      rect.on('mousemove', evt => {
        let posi = {
          x: evt.offsetX,
          y: evt.offsetY - 40
        }
        rect.attr({
          style: {
            fill: this.gradient[2],
            stroke: this.gradient[3]
          }
        })
        showTips(this.selector, this.data[i], posi)
      })
        .on('mouseout', () => {
          rect.attr({
            style: {
              fill: this.gradient[0],
              stroke: this.gradient[1]
            }
          })
          hideTips(this.selector)
        })
    })
  }

  /**
   *  画右边小圆点
   *  @param    {array}  data [description]
   *  @return   {void}  [description]
   */
  setCircleAttribute(data) {
    const { icon } = this.config.itemStyle.normal
    this.circleGroups.eachChild((circle, i) => {
      circle
        .animateTo({
          shape: {
            cx: this.xScale(data[i]) - icon.radius / 2
          }
        })
    })
  }
} 

