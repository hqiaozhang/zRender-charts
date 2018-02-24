/**
 * @Author:      zhanghq
 * @DateTime:    2017-12-26 17:21:38
 * @Description: 主文件
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-12-26 17:21:38
 */

import './index.css'
import mockApis from './mock'
import loader from '@/loader/loader'
import Charts from './scripts/charts.js'
const charts = new Charts()

loader.load({
  apis: mockApis, 
  init() {
    charts.render()
  }
})
