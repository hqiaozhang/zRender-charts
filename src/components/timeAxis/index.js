/**
 * @Author:      zhanghq
 * @DateTime:    2018-01-09 09:11:06
 * @Description: 时间轴
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2018-01-09 09:11:06
 */

import $ from 'jquery'
import hbs from './hbs/index.hbs'
import timeHbs from './hbs/time.hbs'
import './index.css'

export default class TimeAxis {
  constructor(selector) {
    $(selector).addClass('time-axis-wrap').append(hbs)
    let timeData = ['周二', '周三', '周四', '周五', '周六', '周日', '周一']
    $('.timeline-dots').html(timeHbs(timeData))
  }

  render() {
    const self = this
    self.bindEvent()
  }

  /**
   *  渲染时间线
   *  @example: [example]
   *  @param    {[type]}  data [description]
   *  @return   {[type]}  [description]
   */
  renderTimeline(data) {
    $('.timeline-dots').html(timeHbs(data))
  }

  bindEvent() {
    const self = this
    // 点击默认时间按钮
    $('.current-key').on('click', () => {
      $('.list-key').show()
    })

    $('.list-key').on('click', 'span', (evt) => {
      $('.timeline-dots li').removeClass('transition')
      const $this = $(evt.target)
      let type = $this.attr('type')
      let timeData = []
      switch(type) {
        case 'week':
          timeData = ['周二', '周三', '周四', '周五', '周六', '周日', '周一']
          break
        case 'quarter': // 季
          timeData = ['第一季度', '第二季度', '第三季', '第四季']
          break
        case 'month': // 月
        for(let i = 1; i <= 12; i++) {
          timeData.push(`${i}月`)
        }
          break
        case 'year':
          for(let i = 2000; i <= 2020; i++){
            timeData.push(i)
          }
          break
        default:
          break

      }
      self.renderTimeline(timeData)
    })
  }
}
