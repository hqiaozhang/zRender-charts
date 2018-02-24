/**
 * @Author:      zhanghq
 * @DateTime:    2017-12-28 09:17:30
 * @Description: 地图
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-12-28 09:17:30
 */
import zrender from 'zrender'
import _ from 'lodash'
import mapJson from './mapdata/china.json'

let arrayProto = Array.prototype
let nativeForEach = arrayProto.forEach
let nativeFilter = arrayProto.filter
let nativeMap = arrayProto.map

/**
 * 数组或对象遍历
 * @memberOf module:zrender/core/util
 * @param {Object|Array} obj
 * @param {Function} cb
 * @param {*} [context]
 */
function each$1(obj, cb, context) {
  if (!(obj && cb)) {
    return
  }
  if (obj.forEach && obj.forEach === nativeForEach) {
    obj.forEach(cb, context)
  }else if (obj.length === +obj.length) {
    for (let i = 0, len = obj.length; i < len; i++) {
      cb.call(context, obj[i], i, obj)
    }
  }else {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        cb.call(context, obj[key], key, obj)
      }
    }
  }
}

/**
 * 数组映射
 * @memberOf module:zrender/core/util
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */
function map(obj, cb, context) {
  if (!(obj && cb)) {
    return
  }
  if (obj.map && obj.map === nativeMap) {
    return obj.map(cb, context)
  }else{
    let result = []
    for (let i = 0, len = obj.length; i < len; i++) {
      result.push(cb.call(context, obj[i], i, obj))
    }
    return result
  }
}

/**
 * 数组过滤
 * @memberOf module:zrender/core/util
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */
function filter(obj, cb, context) {
  if (!(obj && cb)) {
    return
  }
  if (obj.filter && obj.filter === nativeFilter) {
    return obj.filter(cb, context)
  }else{
    let result = []
    for (let i = 0, len = obj.length; i < len; i++) {
      if (cb.call(context, obj[i], i, obj)) {
        result.push(obj[i])
      }
    }
    return result
  }
}

/**
 * 求两个向量最小值
 * @param  {Vector2} out
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 */
function min(out, v1, v2) {
  out[0] = Math.min(v1[0], v2[0])
  out[1] = Math.min(v1[1], v2[1])
  return out
}

/**
 * 求两个向量最大值
 * @param  {Vector2} out
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 */
function max(out, v1, v2) {
  out[0] = Math.max(v1[0], v2[0])
  out[1] = Math.max(v1[1], v2[1])
  return out
}

/**
 * @author Yi Shen(https://github.com/pissang)
 */

var mathMin$3 = Math.min
var mathMax$3 = Math.max
// var mathSin$2 = Math.sin
// var mathCos$2 = Math.cos
// var PI2 = Math.PI * 2

// var start = create()
// var end = create()
// var extremity = create()
/**
 * 从顶点数组中计算出最小包围盒，写入`min`和`max`中
 * @module zrender/core/bbox
 * @param {Array<Object>} points 顶点数组
 * @param {number} min
 * @param {number} max
 */
function fromPoints(points, min$$1, max$$1) {
  if (points.length === 0) {
    return
  }
  var p = points[0]
  var left = p[0]
  var right = p[0]
  var top = p[1]
  var bottom = p[1]
  var i

  for (i = 1; i < points.length; i++) {
    p = points[i]
    left = mathMin$3(left, p[0])
    right = mathMax$3(right, p[0])
    top = mathMin$3(top, p[1])
    bottom = mathMax$3(bottom, p[1])
  }
  min$$1[0] = left
  min$$1[1] = top
  max$$1[0] = right
  max$$1[1] = bottom
}

function windingLine(x0, y0, x1, y1, x, y) {
    if ((y > y0 && y > y1) || (y < y0 && y < y1)) {
        return 0;
    }
    // Ignore horizontal line
    if (y1 === y0) {
        return 0;
    }
    var dir = y1 < y0 ? 1 : -1
    var t = (y - y0) / (y1 - y0)

    // Avoid winding error when intersection point is the connect point of two line of polygon
    if (t === 1 || t === 0) {
        dir = y1 < y0 ? 0.5 : -0.5
    }

    var x_ = t * (x1 - x0) + x0

    return x_ > x ? dir : 0
}

var EPSILON$3 = 1e-8
function isAroundEqual$1(a, b) {
    return Math.abs(a - b) < EPSILON$3
}

function contain$1(points, x, y) {
    var w = 0
    var p = points[0]

    if (!p) {
        return false
    }

    for (var i = 1; i < points.length; i++) {
        var p2 = points[i];
        w += windingLine(p[0], p[1], p2[0], p2[1], x, y)
        p = p2
    }

    // Close polygon
    var p0 = points[0];
    if (!isAroundEqual$1(p[0], p0[0]) || !isAroundEqual$1(p[1], p0[1])) {
        w += windingLine(p[0], p[1], p0[0], p0[1], x, y);
    }

    return w !== 0;
}

/**
 * 矩阵左乘向量
 * @param {Vector2} out
 * @param {Vector2} v
 * @param {Vector2} m
 */
function applyTransform(out, v, m) {
    var x = v[0]
    var y = v[1]
    out[0] = m[0] * x + m[2] * y + m[4]
    out[1] = m[1] * x + m[3] * y + m[5]
    return out
}

/**
 * @module echarts/core/BoundingRect
 */

var v2ApplyTransform = applyTransform;
var mathMin = Math.min
var mathMax = Math.max
/**
 * @alias module:echarts/core/BoundingRect
 */
function BoundingRect(x, y, width, height) {
    let x2 = 0
    let y2 = 0
    let w2 = 0
    let h2 = 0
    if (width < 0) {
        x2 = x + width;
        w2 = -width;
    }
    if (height < 0) {
        y2 = y + height;
        h2 = -height;
    }

    /**
     * @type {number}
     */
    this.x = x2
    /**
     * @type {number}
     */
    this.y = y2
    /**
     * @type {number}
     */
    this.width = w2
    /**
     * @type {number}
     */
    this.height = h2
}

BoundingRect.prototype = {

    constructor: BoundingRect,

    /**
     * @param {module:echarts/core/BoundingRect} other
     */
    union: function (other) {
        var x = mathMin(other.x, this.x)
        var y = mathMin(other.y, this.y)

        this.width = mathMax(
                other.x + other.width,
                this.x + this.width
            ) - x
        this.height = mathMax(
                other.y + other.height,
                this.y + this.height
            ) - y
        this.x = x
        this.y = y
    },

    /**
     * @param {Array.<number>} m
     * @methods
     */
    applyTransform: (function () {
        var lt = []
        var rb = []
        var lb = []
        var rt = []
        return function (m) {
            // In case usage like this
            // el.getBoundingRect().applyTransform(el.transform)
            // And element has no transform
            if (!m) {
                return;
            }
            lt[0] = lb[0] = this.x;
            lt[1] = rt[1] = this.y;
            rb[0] = rt[0] = this.x + this.width;
            rb[1] = lb[1] = this.y + this.height;

            v2ApplyTransform(lt, lt, m);
            v2ApplyTransform(rb, rb, m);
            v2ApplyTransform(lb, lb, m);
            v2ApplyTransform(rt, rt, m);

            this.x = mathMin(lt[0], rb[0], lb[0], rt[0]);
            this.y = mathMin(lt[1], rb[1], lb[1], rt[1]);
            var maxX = mathMax(lt[0], rb[0], lb[0], rt[0]);
            var maxY = mathMax(lt[1], rb[1], lb[1], rt[1]);
            this.width = maxX - this.x;
            this.height = maxY - this.y;
        };
    })(),

    /**
     * Calculate matrix of transforming from self to target rect
     * @param  {module:zrender/core/BoundingRect} b
     * @return {Array.<number>}
     */
    calculateTransform: function (b) {
        var a = this;
        var sx = b.width / a.width;
        var sy = b.height / a.height;

        var m = create$1();

        // 矩阵右乘
        translate(m, m, [-a.x, -a.y]);
        scale$1(m, m, [sx, sy]);
        translate(m, m, [b.x, b.y]);

        return m;
    },

    /**
     * @param {(module:echarts/core/BoundingRect|Object)} b
     * @return {boolean}
     */
    intersect: function (b) {
        if (!b) {
            return false;
        }
        if (!(b instanceof BoundingRect)) {
            // Normalize negative width/height.
            b = BoundingRect.create(b)
        }

        var a = this;
        var ax0 = a.x;
        var ax1 = a.x + a.width;
        var ay0 = a.y;
        var ay1 = a.y + a.height;

        var bx0 = b.x;
        var bx1 = b.x + b.width;
        var by0 = b.y;
        var by1 = b.y + b.height;

        return ! (ax1 < bx0 || bx1 < ax0 || ay1 < by0 || by1 < ay0);
    },

    contain: function (x, y) {
        var rect = this;
        return x >= rect.x
            && x <= rect.x + rect.width
            && y >= rect.y
            && y <= rect.y + rect.height
    },

    /**
     * @return {module:echarts/core/BoundingRect}
     */
    clone: function () {
        return new BoundingRect(this.x, this.y, this.width, this.height);
    },

    /**
     * Copy from another rect
     */
    copy: function (other) {
        this.x = other.x;
        this.y = other.y;
        this.width = other.width;
        this.height = other.height;
    },

    plain: function () {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

/**
 * @param {string} name
 * @param {Array} geometries
 * @param {Array.<number>} cp
 */
function Region(name, geometries, cp) {
  /**
   * @type {string}
   * @readOnly
   */
  this.name = name

  /**
   * @type {Array.<Array>}
   * @readOnly
   */
  this.geometries = geometries
  let nCp = null

  if(!cp){
    var rect = this.getBoundingRect()
    nCp = [
      rect.x + rect.width / 2,
      rect.y + rect.height / 2
    ]
  }else{
    nCp = [cp[0], cp[1]]
  }
  /**
   * @type {Array.<number>}
   */
  this.center = nCp
}

Region.prototype = {

  constructor: Region,

    properties: null,

    /**
     * @return {module:zrender/core/BoundingRect}
     */
    getBoundingRect: function () {
        var rect = this._rect
        if (rect) {
            return rect
        }

        var MAX_NUMBER = Number.MAX_VALUE
        var min$$1 = [MAX_NUMBER, MAX_NUMBER]
        var max$$1 = [-MAX_NUMBER, -MAX_NUMBER]
        var min2 = []
        var max2 = []
        var geometries = this.geometries
        for (var i = 0; i < geometries.length; i++) {
            // Only support polygon
            if (geometries[i].type !== 'polygon') {
                continue
            }
            // Doesn't consider hole
            var exterior = geometries[i].exterior
            fromPoints(exterior, min2, max2)
            min(min$$1, min$$1, min2)
            max(max$$1, max$$1, max2)
        }
        // No data
        if (i === 0) {
            min$$1[0] = min$$1[1] = max$$1[0] = max$$1[1] = 0;
        }
        return (this._rect = new BoundingRect(
            min$$1[0], min$$1[1], max$$1[0] - min$$1[0], max$$1[1] - min$$1[1]
        ));
    },

    /**
     * @param {<Array.<number>} coord
     * @return {boolean}
     */
    contain: function (coord) {
        var rect = this.getBoundingRect()
        var geometries = this.geometries
        if (!rect.contain(coord[0], coord[1])) {
            return false
        }
        loopGeo: for (var i = 0, len$$1 = geometries.length; i < len$$1; i++) {
            // Only support polygon.
            if (geometries[i].type !== 'polygon') {
                continue
            }
            var exterior = geometries[i].exterior
            var interiors = geometries[i].interiors
            if (contain$1(exterior, coord[0], coord[1])) {
                // Not in the region if point is in the hole.
                for (var k = 0; k < (interiors ? interiors.length : 0); k++) {
                    if (contain$1(interiors[k])) {
                        continue loopGeo
                    }
                }
                return true;
            }
        }
        return false;
    },

    transformTo: function (x, y, width, height) {
        var rect = this.getBoundingRect()
        var aspect = rect.width / rect.height
        let nwidth = 0
        let nheight = 0
        if (!width) {
           nwidth = aspect * height
        }else if(!height) {
           nheight = width / aspect 
        }
        var target = new BoundingRect(x, y, nwidth, nheight)
        var transform = rect.calculateTransform(target)
        var geometries = this.geometries
        for (var i = 0; i < geometries.length; i++) {
            // Only support polygon.
            if (geometries[i].type !== 'polygon') {
                continue
            }
            var exterior = geometries[i].exterior
            var interiors = geometries[i].interiors
            for (var p = 0; p < exterior.length; p++) {
                self.applyTransform(exterior[p], exterior[p], transform)
            }
            for (var h = 0; h < (interiors ? interiors.length : 0); h++) {
                for (var p2 = 0; p2 < interiors[h].length; p2++) {
                    self.applyTransform(interiors[h][p2], interiors[h][p2], transform)
                }
            }
        }
        rect = this._rect
        rect.copy(target)
        // Update center
        this.center = [
            rect.x + rect.width / 2,
            rect.y + rect.height / 2
        ]
    }
}

export default class BaseMap {
  /**
   * 地图默认配置项
   * @return {object} 默认配置项
   */
  defaultSetting () {
    return{
      width: 900,
      height: 600 
    }  
  }
 
  /**
   * Creates an instance of Heatmap
   * @param {string} selector 容器元素选择器
   * @param {object} opt 图表组件配置项
   */
  constructor(selector, opt) {
    // 获取配置项
    const defaultSetting = this.defaultSetting()
    this.config = _.merge({}, defaultSetting, opt)
    const { width, height } = this.config
    this.zr = zrender.init(document.querySelector(selector), {
      renderer: 'canavs',
      width: width,
      height: height
    })
  }

  /**
   *  渲染
   *  @example: [example]
   *  @param    {[type]}  data [description]
   *  @return   {[type]}  [description]
   */
  render() {
    const self = this
    self.zr.clear()
    let dataset = self.parseGeoJson(mapJson)
    console.log(dataset)
    self.setPolygon(dataset)
  }

  setPolygon(data) {

    const polygonG = new zrender.Group()
    data.map(() => {
      const polygon = new zrender.Polygon({
        shape: {
          points: data
        },
        style: {
          fill: 'red',
          stroke: 'yellow'
        }
      })
      polygonG.add(polygon)
    })
  }

  /**
 * Parse and decode geo json
 * @module echarts/coord/geo/parseGeoJson
 */

  decode(json) {
    const self = this
    if (!json.UTF8Encoding) {
      return json
    }
    let encodeScale = json.UTF8Scale
    if (encodeScale === null) {
      encodeScale = 1024
    }
    let features = json.features
    for (let f = 0; f < features.length; f++) {
      let feature = features[f]
      let geometry = feature.geometry
      let coordinates = geometry.coordinates
      let encodeOffsets = geometry.encodeOffsets
      for (let c = 0; c < coordinates.length; c++) {
        let coordinate = coordinates[c]
        if (geometry.type === 'Polygon') {
          coordinates[c] = self.decodePolygon(
            coordinate,
            encodeOffsets[c],
            encodeScale
          )
        }else if (geometry.type === 'MultiPolygon') {
          for (let c2 = 0; c2 < coordinate.length; c2++) {
            let polygon = coordinate[c2]
            coordinate[c2] = self.decodePolygon(
              polygon,
              encodeOffsets[c][c2],
              encodeScale
            )
          }
        }
      }
    }
    // Has been decoded
    json.UTF8Encoding = false
    return json
  }

  decodePolygon(coordinate, encodeOffsets, encodeScale) {
    let result = []
    let prevX = encodeOffsets[0]
    let prevY = encodeOffsets[1]
    for (let i = 0; i < coordinate.length; i += 2) {
      let x = coordinate.charCodeAt(i) - 64
      let y = coordinate.charCodeAt(i + 1) - 64
      // ZigZag decoding
      x = x >> 1 ^ -(x & 1)
      y = y >> 1 ^ -(y & 1)
      // Delta deocding
      x += prevX
      y += prevY

      prevX = x
      prevY = y
      // Dequantize
      result.push([x / encodeScale, y / encodeScale])
    }
    return result
  }

  /**
   * @alias module:echarts/coord/geo/parseGeoJson
   * @param {Object} geoJson
   * @return {module:zrender/container/Group}
   */
  parseGeoJson (geoJson) {
    const self = this
    self.decode(geoJson)
    return map(filter(geoJson.features, (featureObj) => {
      // Output of mapshaper may have geometry null
      return featureObj.geometry
        && featureObj.properties
        && featureObj.geometry.coordinates.length > 0
    }), (featureObj) => {
      let properties = featureObj.properties
      let geo = featureObj.geometry
      let coordinates = geo.coordinates
      let geometries = []
      if (geo.type === 'Polygon') {
        geometries.push({
          type: 'polygon',
          // According to the GeoJSON specification.
          // First must be exterior, and the rest are all interior(holes).
          exterior: coordinates[0],
          interiors: coordinates.slice(1)
        })
      }
      if (geo.type === 'MultiPolygon') {
        each$1(coordinates, (item) => {
          if (item[0]) {
            geometries.push({
              type: 'polygon',
              exterior: item[0],
              interiors: item.slice(1)
            })
          }
        })
      }
      let region = new Region(
        properties.name,
        geometries,
        properties.cp
      )
      region.properties = properties
      return region
    })
  }
}

