<template>
    <div class="ed_indicator_wrap">
        <div class="ed_indicator" v-if="!edIndicatorSlot">
            <div
                class="ed_indicator-cell" 
                :class="dataInfo.realityIndex === inedx ? 'ed_indicator-cell_active' : ''" 
                v-for="(item, inedx) in dataSet.urlList" :key="inedx"
                 @click="setImgTransform(inedx)"></div>
        </div>
        <slot v-else name="ed_indicator" :realityIndex="dataInfo.realityIndex"></slot>

    </div>
</template>

<script>
import Bus from '../js/bus'
export default {
    name: 'ed-indicator',
    props: {
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
    },
    data () {
        return {
            dataInfo : { // 无缝切换传过来的值
                realityIndex: 0, // 图片实际下标
            },
        }
    },
    created() {

        // 监听无缝切换图片下标及其他属性
        Bus.$on('event' + this.topLeveClass, (obj) => {
            for (var key in obj) {
                this.$set(this.dataInfo, key, obj[key])
            }
        })
    },
    mounted() {
    },
    methods: {
        // 点击指示器,移动图片
        setImgTransform(val) {
            Bus.$emit('event' + this.topLeveClass + 'trans', val)
        }
    }
}
</script>
<style lang="scss" scoped>
.ed_indicator_wrap {
    .ed_indicator {
        bottom: 15px;
        display: flex;    
        margin: 10px 0;
        justify-content: center;
        .ed_indicator-cell {    
            height: 10px;
            width: 10px;
            background: #cccccc;
            border-radius: 50%;
            margin-right: 10px;
        }
        .ed_indicator-cell:hover {
            cursor: pointer;
        }
        .ed_indicator-cell:last-child {
                margin-right: 0px;
        }
        .ed_indicator-cell_active {
            background: black;
        }
    }
}
</style>