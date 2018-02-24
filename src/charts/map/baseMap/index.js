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
    // self.parseGeoJson(mapJson)
    console.log(self.parseGeoJson(mapJson))
    // self.setPolygon(dataset)
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

  parseGeoJson(geoJson) {
    const self = this
    self.decode(geoJson)
    const { map, filter, each } = zrender.util
    return map(filter(geoJson.features, (featureObj) => {
      console.log(featureObj)
      // Output of mapshaper may have geometry null
      return featureObj.geometry
          && featureObj.properties
          && featureObj.geometry.coordinates.length > 0
    }), (featureObj) => {
      // var properties = featureObj.properties
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
        each(coordinates, (item) => {
           if (item[0]) {
              geometries.push({
                  type: 'polygon',
                  exterior: item[0],
                  interiors: item.slice(1)
              }) 
          }
        })
      }
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
   
    if (encodeScale === undefined) {
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
}
