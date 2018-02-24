/*
 * @Author: zhanghongqiao@hiynn.com 
 * @Date: 2018-01-22 09:46:04 
 * @Description: 绘制三角柱形扩展
 * @Last Modified by: zhanghongqiao@hiynn.com
 * @Last Modified time: 2018-01-22 10:36:43
 */
 
import zrender from 'zrender'
export default zrender.Path.extend({
  type: 'trigonBar',
  shape: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  /**
   * 创建路径
   * @param  {Object} ctx   可看做绘图环境对象
   * @param  {Object} shape 定义的 shape 属性
   * @return {void}   void
   */
  buildPath(ctx, shape) {
    let { x, y, width, height } = shape
    let controlPoint = [
      x + width / 2,
      y + height / 2
    ]
    // 第一点(顶点)
    ctx.moveTo(x + width / 2, y)
    // 第一条边结束（控制点、描点）
    ctx.quadraticCurveTo(controlPoint[0], controlPoint[1], x, y + height)
    // 第二条边
    ctx.lineTo(x + width, y + height)
    // 第三条边(控制点、描点)
    ctx.quadraticCurveTo(controlPoint[0], controlPoint[1], x + width / 2, y)
    // 闭合路径
    ctx.closePath()
  }
})
