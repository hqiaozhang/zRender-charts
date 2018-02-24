/**
 * @Author:      zhanghq
 * @DateTime:    2017-09-21 08:56:13
 * @Description: 添加X轴线
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-09-21 08:56:13
 */

import d3 from 'd3'
import _ from 'lodash'
import zrender from 'zrender'
import { CountMargin } from '../util'

export default class XAxis {
  /**
   * x轴默认配置项
   * @return   {void}
   */
  defaultSetting() {
    return {
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
   * Creates an instance of addAxis
   * @param {object} zr zr容器
   * @param {object} opt 配置项
   */
  constructor(zr, opt) {
    this.zr = zr
    this.config = _.merge({}, this.defaultSetting(), opt)
    let margin = new CountMargin(this.config)
    this.config = _.merge({}, this.config, margin)
  }

  /**
   *  渲染x轴
   *  @param    {array}  data 图表数据
   *  @return   {void}
   */
  render(data) {
    const self = this
    const { margin, height, xWidth, grid } = self.config
    const { left, bottom } = margin
    
    const xAxisG = new zrender.Group()
    xAxisG.position = [left, height - bottom]
    const line = new zrender.Line({
      shape: {
        x1: 0,
        x2: xWidth - left + grid.left
      },
      style: {
        stroke: '#454c72'
      }
    })
    xAxisG.add(line)
    // x轴比例尺
    self.xScale = d3.scale.linear()
      .domain([0, data.length])
      .range([grid.left, xWidth - grid.left])

    self.axisLabel(data, xAxisG)
    return self.xScale
  }

  /**
   *  设置x轴文字属性
   *  @param    {array}  data 数据
   *  @param    {object}  xAxisG x轴g元素
   *  @return   {void}
   */
  axisLabel(data, xAxisG) {
    const self = this
    data.map((d, i) => {
      const text = new zrender.Text({
        cursor: 'default',
        style: {
          text: d.name,
          textAlign: 'center',
          y: 5,
          x: self.xScale(i),
          textFill: '#fff',
          opacity: 0
        }
      })
      text.animateTo({
        style: {
          opacity: 1
        }
      }, 400)
         
      xAxisG.add(text)
    })  
    self.zr.add(xAxisG)
  }
}
