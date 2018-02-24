/*
 * @Author: zhanghongqiao@hiynn.com 
 * @Date: 2018-01-31 15:43:05 
 * @Description: 玫瑰饼图
 * @Last Modified by: zhanghongqiao@hiynn.com
 * @Last Modified time: 2018-02-01 17:02:59
 */
import zrender from 'zrender'
import d3 from 'd3'
import { Pie } from '../../util/shapes'
import Init from './init'
import Legend from './legend'
import { showTips, hideTips } from './tips.js'

export default class RosePie extends Init {
  /**
   * Creates an instance of RosePie
   * @param {string} selector 容器元素选择器
   * @param {object} opt 图表组件配置项
   */
  constructor(selector, opt) {
    super(selector, opt)
    // 初始化图例
    // Legend.prototype.constructor.call(this)
    this.legend = new Legend(this)
  }
  
  /**
   * 渲染
   * @param {array} data 图表数据
   * @return {void}  void
   */
  render(data) {
    const self = this
    const { width, height, itemStyle } = self.config
    const { right } = itemStyle.margin
    let radius = Math.min(width - right, height) / 2 - 20
    let innerRadius = 0.2 * radius
    itemStyle.radius = radius
    itemStyle.innerRadius = innerRadius
    let dataset = []
    data.map((d) => dataset.push(d.value))
    // 可以返回自然数，获取值大值，计算比例尺 返回 10 的 max.length 次幂。  
    let pow = Math.pow(10, String(d3.max(dataset)).length)
    itemStyle.pow = pow
    // 转换数据  
    let pieData = self.pie(data)   
    // 初始化组元素
    if(this.isInit){
      self.initGroup(pieData) 
      this.isInit = false
    }
    // 渲染路径
    self.setPieAttribute(pieData)  
    // 渲染线条
    // self.setLineAttribute(pieData)
    // 渲染文字
    // self.setTextAttribute(data)
    // 渲染图例
    this.legend.render(data)
  }

  /**
   * 初始化组元素
   * @param  {array} data 图表数据
   * @return {void}  void
   */  
  initGroup(data) {
    data.map((d, i) => {
      const { innerRadius, colors } = this.config.itemStyle
      // 圆弧 
      let pie = new Pie({
        shape: {
          cx: 0,
          cy: 0,
          innerRadius: innerRadius
        },
        style: {
          fill: colors[i]
        }
      })
      this.pieGroup.add(pie)
      // 线条
      let line = new zrender.Polyline()
      this.lineGroup.add(line)
      // name文字
      let name = new zrender.Text()
      this.textGroups[0].add(name)
      // value文字
      let value = new zrender.Text()
      this.textGroups[1].add(value)
    })
    this.zr.add(this.lineGroup)
    this.zr.add(this.pieGroup)
    this.zr.add(this.textGroups[0])
    this.zr.add(this.textGroups[1])
  }

  /**
   * pie元素属性设置
   * @param  {any} data 图表数据(使用pie方法转换后的)
   * @return {void}  void
   */
  setPieAttribute(data) {
    const { radius, innerRadius, pow } = this.config.itemStyle
    this.pieGroup.eachChild((pie, i) => {
      pie.attr({
        data: data[i].data,
        shape: {
          innerRadius: innerRadius,
          outerRadius: (radius - innerRadius) * (data[i].data.value / pow) + innerRadius
        }
      })
      pie.animateTo({
        shape: {
          startAngle: data[i].startAngle,
          endAngle: data[i].endAngle
        }
      })
      // 事件绑定
      pie.on('mousemove', evt => {
        const $this = evt.target
        // 获取位置
        let posi = {
          x: evt.offsetX,
          y: evt.offsetY - 60
        } 
        // 显示提示框
        showTips(this.selector, $this.data, posi)
      })
      pie.on('mouseover', evt => {
        const $this = evt.target
        $this.animateTo({
          shape: {
            outerRadius: $this.shape.outerRadius + 20
          }
        }, 100)
      })
      pie.on('mouseout', evt => {
        const $this = evt.target
        $this.animateTo({
          shape: {
            outerRadius: $this.shape.outerRadius - 20
          }
        })
        hideTips(this.selector)
      }, 100)
    })
  }

  /**
   * 引线 
   * @param {array} data  图表数据
   * @return {void}  void
   */
  setLineAttribute(data) {
    // const { width, height, itemStyle } = this.config
    const { radius, innerRadius, pow } = this.config.itemStyle
    // 两条拆线的长度
    let lineLen = 60
    let lineLen2 = 50
    // 文字的坐标点
    this.textPosition = []
    this.lineGroup.eachChild((Polyline, i) => {
      let outerRadius = (radius - innerRadius) * (data[i].data.value / pow) + innerRadius
      // 中心点
      let centerAngle = data[i].endAngle - (data[i].endAngle - data[i].startAngle) / 2
      // 第一个坐标点
      let x1 = Math.cos(centerAngle) * outerRadius
      let y1 = Math.sin(centerAngle) * outerRadius
      // 第二个坐标点
      let x2 = Math.cos(centerAngle) * (outerRadius + lineLen)
      let y2 = Math.sin(centerAngle) * (outerRadius + lineLen)
      // 第三个坐标点
      let y3 = y2 
      let x3 = 0
      x2 > 1 ? x3 = x2 + lineLen2 : x3 = x2 - lineLen2
      this.textPosition.push([x3, y3])
      Polyline.attr({
        shape: {
          points: [[x1, y1], [x2, y2], [x3, y3]]
        },
        style: {
          stroke: '#fff'
        }
      })
    })
  }

  /**
   * 文字属性设置
   * @param  {array} data 图表数据
   * @return {void}  void
   */
  setTextAttribute(data) {
    this.textGroups.map(group => {
      let type = group.type
      group.eachChild((text, i) => {
        let y = this.textPosition[i][1]
        text.attr({
          style: {
            text: type === 'name' ? data[i].name : data[i].value,
            x: this.textPosition[i][0],
            y: type === 'name' ? y - 15 : y,
            textFill: '#fff'
          }
        })
      })
    })
  }
}

