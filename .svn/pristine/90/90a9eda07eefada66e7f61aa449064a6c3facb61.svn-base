/*
 * @Author: zhanghongqiao@hiynn.com 
 * @Date: 2018-01-22 10:49:35 
 * @Description: 雷达图
 * @Last Modified by: zhanghongqiao@hiynn.com
 * @Last Modified time: 2018-01-22 12:56:36
 */
 
import zrender from 'zrender' 
import _ from 'lodash'
import { InitZr } from '../../util/initZr'
import { CountMargin } from '../../util/util'

export default class RadarCharts {
  /**
   * 图表默认配置项
   * @return {object} 默认配置项
   */
  defaultSetting () {
    return{
      width: 600,
      height: 300,
      itemStyle: {
        fill: '#3ed5de',
        level: 5,
        radius: 150,
        rangeMin: 0,
        rangeMax: 100,
        stroke: '#ccc',
        lineWidth: 1,
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
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
   * Creates an instance of RadarCharts
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
    this.mainGroup = new zrender.Group()
    this.mainGroup.position = [width / 2, height / 2]
  }
  render(datas) {
    let data = datas.slice(0, 5)
    let dataset = []
    data.map(d => dataset.push(d.value))
    // 网轴的范围，类似坐标轴
    let arc = 2 * Math.PI 
    let dataLen = data.length
    // 每项指标所在的角度
    let angle = arc / dataLen
    // 计算网轴的正多边形的坐标
    let polygons = {
      webs: [],
      webPoints: []
    } 
    const { level, radius } = this.config.itemStyle
    for(let k = level; --k > 0;) {
      let webs = '' 
      let webPoints = []
      let r = radius / level * k
      for(let i = 0; i < dataLen; i++) {
        // 计算n边形各个点的位置
        let x = r * Math.sin(i * angle)
        let y = r * Math.cos(i * angle)
        webs += `${x},${y}` // 注意后面的空格必须留着
        webPoints.push([x, y])
      }
      polygons.webs.push(webs)
      polygons.webPoints.push(webPoints)
    }
    this.drawWeblines(polygons.webPoints)

    // 计算雷达图表的坐标
    let areasData = []
    let datasets = [dataset]
    const { rangeMin, rangeMax } = this.config.itemStyle
    for(let i = 0; i < datasets.length;i++) {
      let value = datasets[i]
      let area = '' 
      let points = []
      for(let k = 0;k < dataLen; k++) {
        let r = 20 * (value[k] - rangeMin) / (rangeMax - rangeMin)
        let x = r * Math.sin(k * angle) 
        let y = r * Math.cos(k * angle)
        area += `${x},${y}` // 注意后面的空格必须留着
        points.push([x, y])
      }
      areasData.push({
        polygon: area,
        points: points
      })
    }
    
    this.drawRadarArea(areasData)
    // 
  }

  /**
   * 设置多边形状 
   * @param {array} data 
   */

  drawWeblines(data) {
    // 创建网格线
    data.map(d => {
      let polygon = new zrender.Polygon({
        cursor: 'default',
        shape: {
          points: d
        },
        style: {
          fill: 'none',
          stroke: '#ccc',
          lineWidth: 2
        }
      })
      this.mainGroup.add(polygon)
    })
    
  }

  /**
   * 画雷达区域
   * @param {object} data 
   */
  
  drawRadarArea(data) {
    console.log(data[0].points)
    let polygon = new zrender.Polygon({
      cursor: 'default',
      shape: {
        points: data[0].points
      },
      style: {
        fill: '#08d1e5'
      }
    })
    this.mainGroup.add(polygon)
    this.zr.add(this.mainGroup)
  }
}
