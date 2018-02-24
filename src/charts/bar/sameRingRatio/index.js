/**
 * @Author:      zhanghq
 * @DateTime:    2018-01-08 11:48:52
 * @Description: 同环比图表
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2018-01-08 11:48:52
 */

import './index.css'
import $ from 'jquery'
import zrender from 'zrender'
import _ from 'lodash'
import { YAxis, XAxis } from '../../util/axis'
import { InitZr } from '../../util/initZr'
import { CountMargin } from '../../util/util'
import { showTips, hideTips } from './tips.js'
import Legend from './legend.js'

export default class SameRingRation {
  /**
   * 图表默认配置项
   * @return {object} 默认配置项
   */
  defaultSetting () {
    return{
      width: 600,
      height: 300,
      tooltip: {
        show: true
      },
      // 图例配置项
      legend: {
        show: true,
        name: ['趋势', '同比', '环比']
      },
      // 图表配置项
      itemStyle: {
        width: 15,
        radius: 10,
        fill: ['#ffe003', '#08e2ff', '#0b6fff'], // 趋势、同比、环比
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 25
        },
        icon: {
          fill: '#dff02e',
          stroke: 'rgba(223, 240, 46, 0.4)',
          radius: 6,
          lineWidth: 8
        }
      },
      // Y轴配置项
      yAxis: {
        position: 'right',
        format: '%'
      },
      margin: {
        top: 30,
        right: 50,
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
    const { width, height, itemStyle, tooltip, legend } = this.config
    let margin = new CountMargin(this.config)
    this.config = _.merge({}, this.config, margin)
    this.zr = new InitZr(selector, width, height)
    // 是否需提示框 
    if(tooltip.show) {
      $(selector).append('<div class="charts-tooltip"></div>')
    }
    // 实例化左边Y轴 
    this.lYAxis = new YAxis(this.zr, this.config)
    // 右边Y轴配置项
    this.config.yAxis = {position: 'left', format: ''}
    // 实例化右边Y轴
    this.rYAxis = new YAxis(this.zr, this.config)
    // 实例化X轴
    this.xAxis = new XAxis(this.zr, this.config)
    let legendData = []
    // 是否显示图例
    if(legend.show){
      // 图例数据
      legend.name.map((d, i) => {
        legendData.push({
          name: d,
          color: itemStyle.fill[i]
        })
      })
      // 实例化图例
      this.legend = new Legend(selector, legendData, this)
    }
    this.polyline = new zrender.Polyline()
    // 小圆点组
    this.circleGroup = new zrender.Group()
    // 矩形条组
    this.rectGroup = [new zrender.Group(), new zrender.Group()]
    const { left, bottom } = this.config.margin
    this.rectGroup.map(d => {
      d.position = [left, -bottom]
    })
      
  }

  /**
   *  渲染
   *  @example: [
   *    {
   *     'name': '@cname', // 名称
   *     'tongbi|1-100': 1, // 同比数据
   *     'huanbi|1-100': 1 // 环比数据
   *     'value|1-1000': 1 // 数值
   *   }
   *  ]
   *  @param    {array}  data 图表数据
   *  @return   {void}  void
   */
  render(data) {
    const self = this
    // 清除画布
    // self.zr.clear()
    // 获取value值
    let tongbiData = [] // 同比数据
    let huanbiData = [] // 环比数据
    let trendData = [] // 趋势
    self.data = data
    data.map((d) => {  
      tongbiData.push(d.tongbi)
      huanbiData.push(d.huanbi)
      trendData.push(d.trend)
    })
    // 获取所有value
    let dataset = [...tongbiData, ...huanbiData]
    // 同比环比取出来
    let newData = [tongbiData, huanbiData]
    // 渲染X轴
    self.xScale = self.xAxis.render(data)
    // 渲染Y轴
    self.yScale = self.lYAxis.render(dataset)
    // 数值比例尺
    self.vScale = self.rYAxis.render(trendData) 
    // 渲染矩形条  
    self.setRectAttribute(newData)
    // 渲染折线
    self.setLineAttribute(trendData)
  }

  /**
   *  画拆线
   *  @param    {array}  data 图表数据
   *  @return   {void}   void
   */
  setLineAttribute(data) {
    const self = this
    const { margin, yHeight, itemStyle } = self.config
    const { icon } = itemStyle
    const { left, top } = margin
    let lines = [[], []]
     
    data.map((d, i) => {
      let x = self.xScale(i) + left
      let y = yHeight - self.vScale(data[i]) + top + 10
      if(y <= 0){
        y = 0
      }
      // 实例化一个iamge
      const circle = new zrender.Circle({
        z: 1,
        data: data[i],
        silent: false,
        shape: {
          r: icon.radius,
          cx: x
        },
        style: {
          fill: icon.fill,
          stroke: icon.stroke,
          lineWidth: icon.lineWidth
        }
      })
      // 动画
      circle.animateTo({
        shape: {
          cy: y  
        }
      }, 350)
      this.circleGroup.add(circle)
      lines[0].push([x, yHeight])
      lines[1].push([x, y])
      circle
        .on('mousemove', evt => {
          evt.target.animateTo({
            shape: {
              r: icon.radius + 5
            }
          }, 150)
          let posi = {
            x: evt.offsetX,
            y: evt.offsetY - 60
          }
          let tipData = {
            name: self.data[i].name,
            values: [self.data[i].trend]
          }
          showTips(self.selector, tipData, posi) 
        })
        .on('mouseout', (evt) => {
          evt.target.animateTo({
            shape: {
              r: icon.radius
            }
          }, 150)
          // 移出提示框
          hideTips(self.selector)
        })
    })

    // 实例化折线
    const polyline = this.polyline.attr({
      z: 1,
      cursor: 'default',
      shape: {
        points: lines[0],
        smooth: '0'
      },
      style: {
        stroke: '#ffce10',
        fill: 'none',
        lineWidth: 2
      }
    })
    // 添加动画过渡
    polyline.animateTo({
      shape: {
        points: lines[1]
      }
    }, 350)
    // 添加拆线
    self.zr.add(polyline)
    // 添加icon图标
    self.zr.add(this.circleGroup)
  }

  /**
   * 矩形属性设置
   * @param {array} data 图表数据
   * @return   {void}  void
   */
  setRectAttribute(data) {
    const self = this
    const { itemStyle, height } = self.config
    const { fill, width: iWidth } = itemStyle
    data.map((d, i) => {
      d.map((v, j) => {
        let h = self.yScale(v)
        let rect = new zrender.Rect({
          z: 1,
          shape: {
            width: iWidth,
            height: 0,
            x: self.xScale(j) - iWidth + i * iWidth,
            y: height
          },
          style: {
            fill: fill[i + 1]
          }
        })
        // 添加动画
        rect.animateTo({
          shape: {
            height: h,
            y: height - h
          }
        }, 350)
        // 添加到组元素中
        this.rectGroup[i].add(rect)
        // 事件绑定
        rect
          .off('mousemove')
          .off('mouseout')
          .on('mousemove', (evt) => {
            let posi = {
              x: evt.offsetX,
              y: evt.offsetY - 90
            }
            let tipData = {
              name: self.data[j].name,
              values: [`${self.data[j].tongbi}%`, `${self.data[j].huanbi}%`]
            }
            showTips(self.selector, tipData, posi) 
          })
          .on('mouseover', () => {
            // 添加背景矩形
            self.hoverRect = self.eventHoverRect(self.xScale(j) + iWidth * 2)
            self.zr.add(self.hoverRect)
          })
          .on('mouseout', () => {
            hideTips(self.selector)
            self.zr.remove(self.hoverRect)
          })
      })
    })
    self.zr.add(this.rectGroup[0])
    self.zr.add(this.rectGroup[1])
  }
 
  /**
   *  hover事件时候的的矩形背景
   *  @param    {number}  x x坐标
   *  @return   {object}  rect实例
   */
  eventHoverRect(x) {
    const { itemStyle, yHeight, margin } = this.config
    const { width: iWidth } = itemStyle
    let hoverRect = new zrender.Rect({
      z: 0,
      cursor: 'default',
      shape: {
        width: iWidth * 3,
        height: yHeight,
        x: x,
        y: margin.top
      },
      style: {
        fill: '#000',
        opacity: '0.2'
      }
    })
    return hoverRect
  }
}
