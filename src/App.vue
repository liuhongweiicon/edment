<template>
  <div id="app">
    <div class="imgApp">
      <ed-carousel ref="mycarousel"
          class="topLeveClass2" 
          :topLeveClass="'topLeveClass2'"
          :width="700"
          :height="400"
          :dataSet="dataSet"
          :iconSize="0"
          :padding="0"
          :interval="3000"
          :direction="'vertical'"
          :isIndicatorSlot="true"
          :scrollTopSpeed='20'>
      </ed-carousel>

      <!-- 定义外部指示器 -->
      <ed-indicator 
          ref="myindicator"
          class="topLeveClass2" 
          :topLeveClass="'topLeveClass2'"  
          :dataSet="dataSet" 
          :edIndicatorSlot="true">

        <!-- 自定义外部指示器 -->
        <template slot-scope="indicator" slot="ed_indicator">
          <div class="ed_indicator custom_ed_indicator">
              <div class="ed_indicator-cell"
              @click="mycarousel(inedx)"
              :class="indicator.realityIndex === inedx ? 'ed_indicator-cell_active' : ''" 
              v-for="(item, inedx) in dataSet.urlList"

              :key="inedx">
                <span class="ed_indicator-cell_spot">{{`0${inedx + 1}`}}</span>
                <span class="ed_indicator-cell_text">{{'/&nbsp;' + item.name}}</span>
                <span class="ed_indicator-cell_sign"></span>
              </div>
          </div>
        </template>
      </ed-indicator>
    </div>

    
      <ed-carousel 
          ref="mycarousel1"  
          class="er" 
          :topLeveClass="'er'"
          :width="532"
          :height="352"
          :dataSet="dataSet"
          :iconSize="0"
          :padding="0"
          :direction="'vertical'"
          :isIndicatorSlot="false"
          :scrollTopSpeed='20' >
      </ed-carousel>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
        dataSet: {
            urlList: [
                {
                    url: 'http://file02.16sucai.com/d/file/2015/0128/8b0f093a8edea9f7e7458406f19098af.jpg',
                    name: '0000000000',
                },
                {
                    url: 'http://file02.16sucai.com/d/file/2014/0704/e53c868ee9e8e7b28c424b56afe2066d.jpg',
                    name: '111111111111',
                },
                {
                    url: 'http://file02.16sucai.com/d/file/2015/0408/779334da99e40adb587d0ba715eca102.jpg',
                    name: '2222222222222222'
                },
                {
                    url: 'http://g.hiphotos.baidu.com/zhidao/pic/item/ac4bd11373f08202b4a9a53a4bfbfbedab641bff.jpg',
                    name: '333333333333333'
                },
                {
                    url: 'http://img.zcool.cn/community/012bc0585250e8a801219c77cf3db4.jpg',
                    name: '444444'
                },
                {
                    url: 'http://wx4.sinaimg.cn/orj360/653345ffly1g9i5ni68ywj20k02a7nk2.jpg',
                    name: '55555555555555555'
                },
            ],
            
        }
    }
  },
  mounted() {
  },
  methods: {

    // 获取当前图片下标
    getRealityIndex(msg) {
      // console.log(msg)
    },

    // 点击指示器移动图片
    mycarousel(val) {
      this.$refs.mycarousel.setImgTransform(val);
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.imgApp {
  // height: 400px;
  width: 700px;
  margin: auto;
  border: 1px solid wheat;
  .custom_ed_indicator {
    display: block !important;
    background: #2D2D39;
    text-align: left;
    letter-spacing: 1px;
    .ed_indicator-cell {
      margin-bottom: 10px;
      height: 30px !important;
      line-height: 30px;
      width: 100% !important;
      border-radius: 0% !important;
      background: #2D2D39 !important;
      color: #ffffff;
      font-size: 16px;
      font-weight: bold;
      .ed_indicator-cell_spot {
        margin: 0 10px;
      }

    }
    .ed_indicator-cell:last-child {
       margin-bottom: 0px;
    }
    .ed_indicator-cell:hover {
      cursor: pointer;
    }
    .ed_indicator-cell_active {
      color: #DAA064 !important;
      .ed_indicator-cell_sign {
        height: 1px;
        width: 96px;
        background: #DAA064;
        display: inline-block;
      }
    }
  }
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
