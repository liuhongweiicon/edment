import edImg from './img/img.vue'; // 缩放移动图片
import edCarousel from './img/carousel.vue' // 无缝切换图片
import edIndicator from './img/indicator.vue' // 无缝切换图片指示器

import './static/css/reset.css'
import './static/iconfont/iconfont'


let yjment = {};

yjment.install = (Vue, options) => {
    
    // Vue.prototype.$getImgInfo = function() {
    //     return _this.getImgInfo()
    // }
    Vue.component(edCarousel.name, edCarousel)
    Vue.component(edImg.name, edImg)
    Vue.component(edIndicator.name, edIndicator)
};

export default yjment;