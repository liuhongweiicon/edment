# yjment

> eduspace vue plugin


## ed-img使用方法

``` bash
# 标签形式使用
<ed-img :dataSet="dataSet"></ed-img>

# 参数介绍
dataSet: {
    width: '100%', // 图片容器高
    height: '100%', // 图片容器宽
    urlList: [ // 图片路径
        url: '',
    ], 
    wheel: true, // 是否允许滚轮缩放大小
    automatic: null, // 是否允许自动切换, 自动切换时间
    preNext: true, // 是否展示上一张和下一张按钮
    operate: true, // 是否展示放大缩小旋转重置按钮
    move: true, // 是否允许拖动
}

# 可操作变量
imgIndex: 0, // 当前图片下标
imgWidth: '', // 图片宽度
imgHeight: '', // 图片高度
scale: 1, // 图片当前缩放比例
rotateDeg: 0, // 图片旋转角度 0 => 0deg 1 => 90Deg
is0perateShow: false, // 是否展示操作按钮, 移入展示

# 切换图片
imgPreNext(true) true => 上一张  false => 下一张

#旋转图片
imgRotate(true)  true => 右转  false => 左转

#缩放图片
setScale(true)  true => 放大  false => 缩小
```

## ed-carousel 使用方法

``` bash
# 标签形式使用

<ed-carousel 
    ref="mycarousel"  
    class="topLeveClass" // 必写, 同一个页面不能重复
    :topLeveClass="'topLeveClass'"  // 必写, 同一个页面不能重复
    :dataSet="dataSet"  
    :width="700" 
    :height="400" 
    :fix="1" 
    :range="1"  
    :iconSize="40" 
    :padding="50" 
    :loop="true" 
    :interval='0' 
    :isImgSlot="false" 
    :isIndicatorSlot="false" 
    :direction="'vertical'" 
    :scrollTopSpeed="0"
    @realityIndex="getRealityIndex">

    <!-- img图片 -->
    使用插槽自定义图片展示样式,  不使用插槽图片展示使用默认样式
    <template slot-scope="user" slot="carousel_img">
        <div class="ed_carousel_cell"  v-for="(item, index) in user.dataSet.urlList" :key="index">
        <img :src="item.url" :alt="item.name ? item.name : ''">
        </div>
    </template>

    <!-- 指示器 -->
    使用插槽自定义指示器展示样式,  不使用插槽指示器展示使用默认样式
    <template slot="carousel_indicator" slot-scope="indicator" >
        <div class="ed_carousel_indicator_wrap jjjj">
            <div 
            class="indicator_item" 
            :class="indicator.indicator === inedx ? 'indicator_item_active' : ''" 
            v-for="(item, inedx) in dataSet.urlList" 
            :key="inedx"
            @click="mycarousel(inedx)">
            </div>
        </div>
    </template>
</ed-carousel>
# 无缝切换控制图片参数
{
    dataSet: {  // 展示图片数据
        urlList: [
            {
                url: '',
                name: '',
            }
        ]
    },
    height: { // 图片容器的高
        type: Number,
        default: 400
    },
    width: { // 图片容器宽度
        type: Number,
        default: 700
    },
    iconSize: { // 左右箭头size
        type: Number,
        default: 50
    },
    padding: { // 图片容器左右padding
        type: Number,
        default: 50
    },
    fix: { // 容器一次展示几张图片
        type: Number,
        default: 1
    },
    range: { // 左右切换, 一次移动几张图片
        type: Number,
        default: 1
    },
    loop: { // 是否开启无限循坏
        type: Boolean,
        default: false
    },
    interval: { // 自动切换时间
        type: Number,
        default: 0
    },
    direction: { // 图片切换防线 horizontal => 水平方向  vertical => 垂直方向
        type: String,
        default: 'horizontal'

    },
    isImgSlot: { // 图片插槽
        type: Boolean,
        default: false
    },
    isIndicatorSlot: { // 指示器插槽
        type: Boolean,
        default: false
    },
    scrollTopSpeed: { // 长图时,是否允许长图滚动, 0 => 不允许滚动,  值为Number类型, 毫秒级
        type: Number,
        default: 0
    },
    topLeveClass: {  // 设置顶层class, 防止全局污染
        type: String,
        default: ''
    }
}


<!-- 定义外部指示器 -->
使用插槽自定义外部指示器展示样式,  不使用插槽指示器展示使用默认样式
<ed-indicator :dataSet="dataSet" :edIndicatorSlot="true">

<!-- 自定义外部指示器 -->
<template slot-scope="indicator" slot="ed_indicator">
    <div class="ed_indicator">
        <div class="ed_indicator-cell" 
        :class="indicator.realityIndex === inedx ? 'ed_indicator-cell_active' : ''" 
        v-for="(item, inedx) in dataSet.urlList" :key="inedx"></div>
    </div>
</template>
</ed-indicator>

# 自定义外部指示器参数
{
    dataSet: { // 指示器数据
                urlList: [],
            },
    edIndicatorSlot: { // 自定义指示器插槽
        type: Boolean,
        default: false
    },
    topLeveClass: {  // 设置顶层class, 防止全局污染
        type: String,
        default: 'topLeveClass'
    }
}

# 注意: 
无缝切换插件和自定义外部指示器插件的topLeveClass必须一致

# 获取当前图片下标

监听子组件realityIndex方法
    返回 {
        realityIndex: 0, // 真实需要图片下标
        imgIndex: 0, // 无限循坏, 改变数据后的图片下标
    }

# 点击指示器切换图片
父组件调用插件setImgTransform(num)方法 num => 点击当前指示器的下标
示例: 
    // 点击指示器移动图片
    mycarousel(val) {
      this.$refs.mycarousel.setImgTransform(val);
    }
# 切换下一张

父组件调用插件nextPrevImg(val)方法 val => true 切换上一张 false => 切换器下一张
示例: 
    // 点击指示器移动图片
    mycarousel(val) {
      this.$refs.mycarousel.nextPrevImg(val);
    }
```