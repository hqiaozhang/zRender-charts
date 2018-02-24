import zrender from 'zrender'

/**
 * 随机生成svg defs中元素的ID
 * 
 * @return 随机生成的ID
 */
export const genSVGDocID = ( () => {
  let id = 1
  return () => {
    let prefix = new Date().valueOf()
    return `hyfe-${prefix}-${id++}`
  }
})()
 
/**
 * 修改颜色的透明度维度
 */
export const modifyAlpha = zrender.color.modifyAlpha

/**
 * 重新计算margin的值
 * @param {array} opt 配置项 
 * @return {void}   void
 */
export const CountMargin = (opt) => {
  const { width, height, itemStyle, margin: mg } = opt
  const { padding: pd } = itemStyle
  // 默认赋值为0
  let [top, right, bottom, left] = [0, 0, 0, 0]
  if(pd !== undefined) {
    [top = 0, right, bottom, left] = [pd.top, pd.right, pd.bottom, pd.left]
  } 
  let grid = {
    top: top,
    right: right,
    bottom:bottom,
    left: left
  }
  // 重新赋值margin的值
  opt.grid = grid
  opt.xWidth = width - mg.left - mg.right
  opt.yHeight = height - mg.top - mg.bottom 
  return opt
}

