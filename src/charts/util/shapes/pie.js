/*
 * @Author: zhanghongqiao@hiynn.com 
 * @Date: 2018-01-22 09:44:43 
 * @Description: 绘制圆环的扩展
 * @Last Modified by: zhanghongqiao@hiynn.com
 * @Last Modified time: 2018-01-22 10:13:10
 */
import zrender from 'zrender'

export default zrender.Path.extend({
  type: 'pie',
  shape: {
    cx: 0,
    cy: 0,
    outerRadius: 0,
    innerRadius: 0,
    startAngle: 0,
    endAngle: 0
  },
  /**
   * 创建路径
   * @param  {Object} ctx   可看做绘图环境对象
   * @param  {Object} shape 定义的 shape 属性
   * @return {void}   void
   */
  buildPath(ctx, shape) {
    let { cx, cy, outerRadius, innerRadius, startAngle, endAngle } = shape
    ctx.arc(cx, cy, outerRadius, startAngle, endAngle, false)
    ctx.arc(cx, cy, innerRadius, endAngle, startAngle, true)
    ctx.closePath()
  }
})
