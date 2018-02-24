## 项目结构说明
### 目录说明
- build 项目启动和构建脚本；
- dist 打包后的项目代码，用于部署；
- doc：项目文档：
  - 需求文档；
  - 设计稿psd；
  - HTML格式的接口文档；
  - 项目维护文档；
  - 前端代码版本管理机制；
  - 前端提供接口文档的统一标准。
- node-modules：使用npm安装的第三方库文件；
- pages：HTML页面；
- src：项目源代码:
  - apps：业务代码，每个页面在apps文件夹下对应一个子目录；
  - charts：使用D3开发的图表组件；
  - helpers：Handlebars辅助方法；
  - loader：业务代码执行之前，加载所需的公用资源，设置开发变量等；
  - util：工具类方法；
  - apis.js：根据配置项配置变量；
  - config.js：配置文件。
- .babelrc：babel配置文件；
- .gitignore：配置git提交时候忽略的文件及文件夹；
- package.json：定义项目依赖的包。

**说明：**所有一级文件夹下面，都可以新建二级文件夹，将同一模块的代码整合在一个文件夹里面。

### 需要特别注意的地方

- scripts文件下分模块建立文件夹，每个模块下所有js都放到对应文件夹中；
- 所有请求都放到入口文件中，包括所有交互，类似Handlebars之类的在使用的模块里面引用；
- 用postcss编写所有CSS；
- 图片上传到SVN之前都压缩一下；
- 只require使用到的JS；
- require模板和图表组件时候，如果使用到2次以上，则在最顶部引入，否则在使用到的方法里面引入；
- 注释，编辑器添加插件，自动生成注释，并且注释和功能必须对应， 方法注释时候如果有数据，可以添加数据结构作为注释的一部分；
- 变量定义，作用域局限于函数级；
- mock数据注释：哪个页面下的哪个模块里的那个接口；
- CSS前缀，根据项目对浏览器的要求来定。

### 使用说明
- 下载该项目，下载地址：`http://192.168.1.170/hyfe/generator-es6`；
- 在`http://192.168.1.170/hyfe/`下创建新的项目，项目名称使用实际开发的项目名称；
- 将新创建的项目clone到本地：`git clone http://192.168.1.170/hyfe/xxx`；
- 将下载的`generator-es6`目录下的所有内容拷贝到新建的项目文件夹中，除过`.git`文件夹；
- 根据实际情况修改对应的文件或文件内容。

### 启动项目
```
$ cd generator-es6
$ npm start
```

然后在浏览器中访问`localhost:8080/testModel.html`即可看到效果。

### 接口配置声明

```
export default {
  fetchUser: {
    // 默认不是websocket接口
    // 未开启proxy时，完整url为config.get('host') + url
    // 开启proxy时，完整url为config.get('proxyHost') + url
    // 可以绑定1个参数，userId
    url: '/users/:userId',
    // 覆盖$.ajax的配置
    config: {
      // 默认method为'get'
      type: 'get'
    },
    // mock配置
    mock: {
      'code': 1,
      'msg': 'success',
      'result': {
        'name': '@cname',
      }
    }
  },
  fetchUserScores: {
    // 是websocket接口
    // 未开启proxy时，完整url为config.get('websocketHost') + url
    // 开启proxy时，完整url为config.get('websocketProxyHost') + url
    isWebsocket: true,
    // 可以绑定3个参数，userId，startDate，endDate
    url: '/users/:userId/:startDate/:endDate',
    // 覆盖$.ajax的配置
    config: {
      // 将ajax的method覆盖为post
      type: 'post'
    },
    // mock配置可以为function，返回值会被作为响应数据
    mock() {
      return {
        code: 1,
        msg: 'success',
        result: {
          score: Math.random()
        }
      }
    }
  }
}
```