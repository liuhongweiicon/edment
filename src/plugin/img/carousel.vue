<template>
    <div class="ed_carousel" >
        <div class="ed_carousel_content">
            <div class="ed_carousel_wrap" v-if="!isImgSlot"  @mouseover="stopMove" @mouseout="startMove">
                <div class="ed_carousel_cell" :class="fix > 1 ? 'carousel_cell_mar' : ''" v-for="(item, index) in newData.urlList" :key="index" >
                    <img class="carousel_cell_cent" :class="!scrollTopSpeed ? 'carousel_cell_cent_scrollTop' : ''" :src="item.url" :alt="item.name ? item.name : ''">
                </div>
            </div>
            <div class="ed_carousel_wrap" v-else  @mouseover="stopMove" @mouseout="startMove">
                <slot name="carousel_img" :dataSet="newData"></slot>
            </div>
        </div>
        
        <span class="ed_carousel_left" :class="loop ? 'carousel_left_sure' : imgIndex ? 'carousel_left_sure' : ''" @click="nextPrevImg(true)">
            <svg class="icon" aria-hidden="true">
                <use  xlink:href="#iconarrow-left"></use>
            </svg>
        </span>
        <span class="ed_carousel_right" :class="loop ? 'carousel_left_sure' : imgIndex !== newListLength ? 'carousel_left_sure' : ''"  @click="nextPrevImg(false)">
            <svg class="icon" aria-hidden="true">
                <use  xlink:href="#iconright"></use>
            </svg>
        </span>

        <div class="ed_carousel_indicator_wrap" :class="this.direction === 'vertical' ? 'ed_carousel_indicator_vertical' : ''" v-if="!isIndicatorSlot">
            <div class="indicator_item" 
                :class="realityIndex === inedx ? 'indicator_item_active' : ''" 
                v-for="(item, inedx) in dataSet.urlList" 
                :key="inedx"
                @click="setImgTransform(inedx)"
                ></div>
        </div>
        <slot v-else name="carousel_indicator" :indicator="realityIndex"></slot>
    </div>
</template>

<script>

import Bus from '../js/bus'
export default {
    name: 'ed-carousel',
    data() {
        return {
            newData: JSON.parse(JSON.stringify(this.dataSet)) || {},
            imgIndex: 0, // 当前图片下标
            realityIndex: 0, // 实际图片下标 
            nextBtn: false, // 下一张按钮可点击状态
            prevBtn: false, // 上一张按钮可点击状态
            newListLength: this.dataSet.urlList.length - 1, // 实际图片数据长度下标
            isSwitch: true, // 是否可以切换图片
            timeStart: 0, // 记录开始动画时间
            moveTime: 0, // 记录鼠标移除时间
            startTranslate: 0, // 记录开始滑动时的translate值
            carouseTtimer: 0, // 自动循坏定时器
            piiicTime: {}, // 长图滚动定时器
            translateStr: this.direction === 'horizontal' ? 'translateX' : 'translateY', // 定义移动方向
            driftDistance: this.direction === 'horizontal' ? this.width : this.height, // 初始化,根据移动方向,定义图片标准移动距离
            topLevelDom: null, // 顶层元素
        }
    },
    props: {
        dataSet: Object,  // 展示图片数据
        height: {
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
        interval: { // 自动切换时间, 毫秒级
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
            default: 'topLeveClass'
        }
    },
    created() {
        // 开启无限循坏时触发
        if (this.loop) {
            // 设施图片数据
            this.setLoopData();
            this.imgIndex = this.fix;
        };
    },
    mounted() {
        this.topLevelDom = document.querySelector('.' + this.topLeveClass);
        // 初始化时, 设置图片位移距离
        const paddingNum = this.direction === 'horizontal' ? this.padding*2 : 0;
        let driftImg = (this.driftDistance - paddingNum)*this.imgIndex*(this.range/this.fix);
        this.startTranslate = -driftImg;
        
        // 设置走马灯宽图组宽
        document.querySelector('.' + this.topLeveClass).style.width = this.width + 'px'
        this.topLevelDom.querySelector('.ed_carousel_content').style.cssText = `height: ${this.height}px; width: ${this.width - this.padding*2}px;`;
        this.topLevelDom.querySelector('.ed_carousel_wrap').style.cssText = `height: ${this.height}px; transform: ${this.translateStr}(${-driftImg}px); `
        // 如果是垂直方向移动, 不设置强制换行和将img设置为块元素(解决img白边)
        if ( this.direction === 'vertical' ) {
            this.topLevelDom.querySelector('.ed_carousel_content').style.whiteSpace = 'normal'; 
            if (!this.isIndicatorSlot) {
                 this.topLevelDom.querySelector('.ed_carousel_indicator_wrap').style.right = this.padding + 5 + 'px';
            }
        } else {
            this.topLevelDom.querySelector('.ed_carousel_content').style.whiteSpace = 'nowrap';
            // const cellDom = this.topLevelDom.querySelectorAll('.ed_carousel_cell');
            // cellDom.forEach((item) => {
            //     item.style.display = 'inline-block';
            // });

        }
        // 无限循坏时需要将动画停止, 通过设置延迟使,修改transition时生效
        setTimeout(() => {
            this.topLevelDom.querySelector('.ed_carousel_wrap').style.cssText = `height: ${this.height}px; transform: ${this.translateStr}(${-driftImg}px); transition: all .5s`;
        }, 100);
        // 设置左右箭头大小和padding
        const svgDom = this.topLevelDom.querySelectorAll('.icon') || [];
        svgDom.forEach((item) => {
            item.style.cssText = `height: ${this.iconSize}px; width: ${this.iconSize}px`;
        });

       // 设置图片容器展示图片张数
        this.setImgNum()

        // 图片是否全部加载完成
        this.loadedImgStyle()

        // 设置自动切换
        this.setLoop()

        //设置长图滚动
        if (this.scrollTopSpeed) this.piiicscrollTop();

        // 监听外部自定义指示器点击事件
         Bus.$on('event' + this.topLeveClass + 'trans', (val) => {
            this.setImgTransform(val)
         })
        
    },
    methods: {
        // 设置图片容器展示图片张数
        setImgNum() {
             // 容器展示多少张图片
            const cellDom = this.topLevelDom.querySelectorAll('.ed_carousel_cell') || [];
            const display = this.direction === 'horizontal' ? 'display: inline-block;' : ''
            cellDom.forEach((item) => {
                let num = (this.width - this.padding*2)/this.fix;
                // 如果现实多张图片, 每张图片宽度减少20px(每张图片增加了padding: 20px)
                if (this.fix >1) {
                    // 使用插槽时, 每张图片不增padding: 20px
                    num = !this.isImgSlot ? num -20 : num
                }
                item.style.cssText = `width: ${num}px; ${display}`
            });
        },

        // 执行自动切换
        setLoop() {
            // 设置自动切换
            if (this.carouseTtimer) window.clearInterval(this.carouseTtimer);
            if (this.interval) {
                this.carouseTtimer = setInterval(() => {
                    this.nextPrevImg(false)
                }, this.interval);
            }
        },

        // 设置图片样式
        loadedImgStyle() {
            const _this = this;
            const imgListDom = this.topLevelDom.querySelectorAll('.carousel_cell_cent')
            imgListDom.forEach((item) => {
                // 图片加载完成后执行
                item.onload = function() {
                    const itemheight = item.offsetHeight;
                    if (itemheight > _this.height) {
                        item.style.cssText = 'top: 0%; transform: none;';
                    }
                }
            });
        },

        // 点击上一张或下一张
        nextPrevImg(val) {
            // debugger
            if (!this.isSwitch) return; // 正在动画中,不能切换下一张
            this.isSwitch = false;
            setTimeout(() => {
                this.isSwitch = true;
            }, 500);
            if (this.loop) { // 无限循坏模式
            
                // val => true 上一张  否者 下一张
                if (val) { // 上一张
                    this.imgIndex--;
                    if (this.imgIndex < this.fix) {
                        this.realityIndex = this.dataSet.urlList.length - this.fix - this.imgIndex;
                    }else {
                        this.realityIndex--;
                    }
                } else { // 下一张
                    this.imgIndex++;
                    if (this.imgIndex === (this.fix + this.dataSet.urlList.length)) {
                        this.realityIndex = 0;
                    } else {
                        this.realityIndex++;
                    }
                }

            } else { // 非循坏模式
                // val => true 上一张  否者 下一张
                if (val) { // 上一张
                    if (!this.imgIndex) return;
                    this.imgIndex--;
                    this.realityIndex--;
                } else { // 下一张
                    if (this.imgIndex === this.newData.urlList.length - 1)  return;
                    this.imgIndex++;
                    this.realityIndex++;
                }
            }
            this.setImgTransform();
            Bus.$emit('event' + this.topLeveClass, this.$data)
        },

        // 图片无缝切换滑动
        setImgTransform(val) {
            // 切换图片是先以前清除长图滚动定时器
            for(var timeKey in this.piiicTime) {
                window.clearInterval(this.piiicTime[timeKey]);
            }
            if (this.carouseTtimer) window.clearInterval(this.carouseTtimer);
            this.setLoop();
            // 点击指示器时
            if (this.loop) { // 无限循坏模式下
                if (val === 0 || val) {
                    this.realityIndex = val;
                    this.imgIndex = this.fix + val;
                }

            } else { // 正常模式下
                if (val ===0 || val) {
                    this.realityIndex = val;
                    this.imgIndex = val;
                }
            }
            
            // 通知父组件,当前选中图片的下标
            this.$emit('realityIndex', {
                realityIndex: this.realityIndex,
                imgIndex: this.imgIndex,
            });
            Bus.$emit('event' + this.topLeveClass, this.$data)
            const wrapDom= this.topLevelDom.querySelector('.ed_carousel_wrap');

            // 计算一次滑动多少张图片的距离
            // 水平方向有padding, 垂直方向没有
            const paddingNum = this.direction === 'horizontal' ? this.padding*2 : 0;
            let driftImg = (this.driftDistance - paddingNum)*this.imgIndex*(this.range/this.fix);
            // 记录开始滑动时的时间 
            this.timeStart = new Date().getTime();
            // 记录开始滑动时的translate
           this.startTranslate = parseInt(wrapDom.style.transform.split('X(')[1]);
           
            wrapDom.style.cssText = `height: ${this.height}px; transform: ${this.translateStr}(${-driftImg}px); transition: all .5s`;


            // 如果是无限循坏模式
            if (this.loop) {
                setTimeout(() => {
                    this.setLoopHeadTail()
                }, 500);
            } 
            else {
                if (this.scrollTopSpeed) 
                //设置长图滚动
                setTimeout(() => {
                    this.piiicscrollTop()
                }, 500);
            }
        },

        // 无限循环模式, 移动到最后一张或第一张图片时的处理
        setLoopHeadTail() {
            const wrapDom= this.topLevelDom.querySelector('.ed_carousel_wrap');
            if (!this.imgIndex) {
                this.imgIndex = this.newData.urlList.length - 1 - (this.fix*2 - 1);
                // 计算一次滑动多少张图片的距离
                // 水平方向有padding, 垂直方向没有
                const paddingNum = this.direction === 'horizontal' ? this.padding*2 : 0;
                let driftImg = (this.driftDistance - paddingNum)*this.imgIndex*(this.range/this.fix);
                wrapDom.style.cssText = `height: ${this.height}px; transform: ${this.translateStr}(${-driftImg}px);`;
            } else if (this.imgIndex === (this.newData.urlList.length - this.fix)) {
                this.imgIndex = this.fix;
                // 计算一次滑动多少张图片的距离
                // 水平方向有padding, 垂直方向没有
                const paddingNum = this.direction === 'horizontal' ? this.padding*2 : 0;
                let driftImg = (this.driftDistance - paddingNum)*this.imgIndex*(this.range/this.fix);
                wrapDom.style.cssText = `height: ${this.height}px; transform: ${this.translateStr}(${-driftImg}px);`;

            }
            
            //设置长图滚动
            if (this.scrollTopSpeed) this.piiicscrollTop()
            
        },


        // 无限循坏模式, 设置数据
        setLoopData() {
            const startNewList = this.dataSet.urlList.slice(0, this.fix);
            const endNewList = this.dataSet.urlList.slice(-this.fix);
            this.newData.urlList.push.apply(this.newData.urlList, startNewList);
            this.newData.urlList.unshift.apply(this.newData.urlList, endNewList);
        }, 

        // 设置长图滚动
        piiicscrollTop() {
            const _this = this;

            // 获取图片容器
            const imgContanintr = this.topLevelDom.querySelectorAll('.ed_carousel_cell');
            // 切换图片是先以前清除长图滚动定时器
            for(var timeKey in this.piiicTime) {
                window.clearInterval(this.piiicTime[timeKey]);
            }

            imgContanintr.forEach((item, index) => {
                if (index >= this.imgIndex && index <= (this.imgIndex + this.fix - 1)) {
                    const imgHeight = item.querySelector('.carousel_cell_cent').offsetHeight;
                    // 动画执行完毕后,开始滚动长图
                   const timerOut = setTimeout(() => {
                        const imgHeight = item.querySelector('.carousel_cell_cent').offsetHeight;
                            if (imgHeight - _this.height > 5) {
                                // 如果是自动切换时, 长图开始滚动时将自动切换停止
                                if (this.interval) window.clearInterval(this.carouseTtimer);
                                this.$set(this.piiicTime, 'timer' + index, window.setInterval(() => {
                                    // 获取图片高度
                                    if (imgHeight - (item.scrollTop + _this.height) > 0) {
                                        item.scrollTop++;
                                    } else {
                                        // if (this.interval) this.setLoop();
                                        // 滚动完毕后,清除定时器
                                        window.clearInterval(this.piiicTime['timer' + index]);

                                        // 如果是自动切换时, 长图开始滚动完毕时,切换下一张并设置自动切换
                                        if (this.interval) {
                                            // 切换下一张后将图片scrollTop设置为0
                                            setTimeout(() => {
                                                this.nextPrevImg(false)
                                            }, 1000);
                                            setTimeout(() => {
                                                item.scrollTop = 0;
                                            }, 1500);
                                        } else { // 否则设置图片循坏滚动
                                            item.scrollTop = 0; 
                                        }
                                        
                                    }
                                }, 20))

                            }
                        clearTimeout(timerOut);
                    }, 0.5);
                }
            });
        },

        // 鼠标移入停止移动
        stopMove() {
            if (!this.interval) return
            clearInterval(this.carouseTtimer);
        },

        // 鼠标移除继续移动
        startMove() {
            if (!this.interval) return

            // 设置自动切换
             this.setLoop()
            
            
        },

    }

}
</script>

<style lang="scss" scoped>
.ed_carousel {
    position: relative;
    display: flex;
    justify-content: center;
    .ed_carousel_content {
        height: 100%;
        // width: 600px;
        overflow: hidden;
        .ed_carousel_wrap {
            // white-space: nowrap;
            .ed_carousel_cell {
                user-select: none;
                // display: inline-block;
                height: 100%;
                position: relative;
                overflow: auto;
                img {
                    width: 100%;
                }
                .carousel_cell_cent {
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .carousel_cell_cent_scrollTop {
                    height: 100%;
                    object-fit: contain;
                }
            }
            .ed_carousel_cell::-webkit-scrollbar {
                display: none;
            }
            .carousel_cell_mar {
                margin:0  10px
            }
            .carousel_cell_mar:last-child {
                margin-right: 0px
            }
        }
    }
    .ed_carousel_left, .ed_carousel_right {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        .icon {
            fill: #cccccc;
        }
    }
    .carousel_left_sure:hover {
        cursor: pointer;
        .icon {
            fill: #7c7c7c;
        }
    }
    .ed_carousel_left {
        left: 0;
    }
    .ed_carousel_right {
        right: 0;
    }
    .ed_carousel_indicator_wrap {
        position: absolute;
        bottom: 15px;
        display: flex;
        .indicator_item {    
            height: 10px;
            width: 10px;
            background: #cccccc;
            border-radius: 50%;
            margin-right: 10px;
        }
        .indicator_item:last-child {
             margin-right: 0px;
        }
        .indicator_item_active {
            background: black;
        }
        .indicator_item:hover {
            cursor: pointer;
        }
    }
    .ed_carousel_indicator_vertical {
        position: absolute;
        display: flex;
        bottom: 0px;
        flex-direction: column;
        top: 50%;
        transform: translateY(-50%);
        justify-content: center;
        .indicator_item {
            margin-right: 0;
            margin-bottom: 10px;
        }
    }
}
</style>