/*
 * @Author: zhanghongqiao@hiynn.com 
 * @Date: 2018-02-01 14:43:14 
 * @Description: 一些初始化方法
 * @Last Modified by: zhanghongqiao@hiynn.com
 * @Last Modified time: 2018-02-01 16:55:02
 */
import d3 from 'd3'
import zrender from 'zrender'
import { InitZr } from '../../util/initZr'
import _ from 'lodash'

export default class Init {
  /**
   * 饼图图默认配置项
   * @return {object} 默认配置项
   */
  defaultSetting () {
    return{
      width: 500,
      height: 500,
      dur: 1000,
      tooltip: {
        show: true
      },
      itemStyle: {
        colors: ['#C32F4B', '#6CC4A4', '#4D9DB4', '#E1514B', '#F47245', '#FB9F59', '#FEC574', 
          '#FAE38C', '#EAF195', '#C7E89E', '#9CD6A4', '#9E0041', '#C32F4B', '#4776B4'],
        margin: {
          top: 6,
          right: 110, 
          bottom: 20,
          left: 40
        },
        hover: {
          fill: '#9CD6A4',
          radius: 20
        }
      },
      legend: {
        radius: 6,
        fontSize: 12,
        fill: '#fff'
      }
    }
  }
  /**
   * Creates an instance of Init
   * @param {string} selector 容器元素选择器
   * @param {object} opt 图表组件配置项
   */
  constructor(selector, opt) {
    let isInstance = true
    this.selector = selector
    const defaultSetting = this.defaultSetting()
    this.config = _.merge({}, defaultSetting, opt)
    const { width, height } = this.config
    if(isInstance) {
      this.zr = new InitZr(selector, width, height) 
      isInstance = false
    }
    
    // 圆弧组元素
    this.pieGroup = new zrender.Group()
    this.pieGroup.position = [width / 2, height / 2]
    // 线条组元素
    this.lineGroup = new zrender.Group()
    this.lineGroup.position = [width / 2, height / 2]
    // 文字name组元素
    this.nameGroup = new zrender.Group({
      type: 'name'
    })
    this.nameGroup.position = [width / 2, height / 2]
    // 文字value组元素
    this.valueGroup = new zrender.Group({
      type: 'value'
    })
    this.valueGroup.position = [width / 2, height / 2]
    // 文字组元素
    this.textGroups = [this.nameGroup, this.valueGroup]
    // 实例化pie
    this.pie = d3.layout.pie()
      .sort(null)
      .value((d) => d.value)
    // 初始化值定义（用于初始化调用方法）
    this.isInit = true
  }
}
