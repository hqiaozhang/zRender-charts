/**
 * @Author:      zhanghq
 * @DateTime:    2017-12-26 17:34:00
 * @Description: Description
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-12-26 17:34:00
 */

import '../index.css'
import { fetch } from '@/util/request'
import { RectBar, BasePie,
  SameRingRation, IconBar, AreaCharts,
  TriangleArea, ArcCharts, RadarCharts, RosePie } from '@/charts/index'

import TimeAxis from '@/components/timeAxis' 

export default class Charts {
  /**
   *  构造函数
   */
  constructor() {
    this.rectBar = new RectBar('.rectbar')
    this.basePie = new BasePie('.basePie')
    this.sameRingRation = new SameRingRation('.sameRingRation')
    this.iconBar = new IconBar('.iconBar')
    this.areaCharts = new AreaCharts('.areaCharts')
    this.triangleArea = new TriangleArea('.triangleArea')
    this.arcCharts = new ArcCharts('.arcCharts')
    this.radarCharts = new RadarCharts('.radarCharts')
    this.rosePie = new RosePie('.rosePie')
    // this.earth = new Earth('#earth')
    // 时间轴
    this.timeAxis = new TimeAxis('.select-time')
    // this.map = new BaseMap('.map')
  }

  render() {
    const self = this
    // self.earth.render() // 地球
    self.timeAxis.render()
    fetch('fetchCharts', data => {
      self.rectBar.render(data)
      self.basePie.render(data)
      self.iconBar.render(data)
      self.areaCharts.render(data)
      self.triangleArea.render(data)
      self.arcCharts.render(data)
      // self.radarCharts.render(data)
      self.rosePie.render(data)
    })

    // 同环比
    fetch('fetchThb', data => {
      self.sameRingRation.render(data)
    })
    // self.map.render()
    // self.times()
  }

  times() {
    const self = this
    setInterval(() => {
      self.render()
    }, 8000)
  }
}
