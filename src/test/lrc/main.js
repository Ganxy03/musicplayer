import lrc from "./data.js";

/**
 * 将歌词字符 转换为对象的形式
 * obj = {time:开始时间, words: 歌词内容}
 */


const parseLrc = () => {
    // 准备好一个包含歌词对象的数组
    const lrcData = [];

    // 按照"]"字符进行分割
    const lines = lrc.split('\n');
    // console.log(lines);
    // 生成一个数组,用来放置每一句歌词对象(包括时间,和 歌词)
    // 循环遍历整个歌词数组
    for (let i = 0; i < lines.length; i++) {
        const item = lines[i].split(']')
        // console.log(item);
        const time = item[0].substring(1);
        const words = item[1].substring(1);
        const obj = {
            time: parseTime(time),
            words
        }
        lrcData.push(obj);
    }
    return lrcData

}


// 转换规则 
//  00:39.32 ===> 0 + 39 + 0.32 = 39.32
// 01:02.86 ===> 60 + 2 + 0.86 = 62.86

const parseTime = (timeStr) => {
    // 进行分割 按照:进行分割
    const parts = timeStr.split(':');

    return Number(parts[0]) * 60 + Number(parts[1])
}
const resulr = parseLrc()

// console.log(resulr);


// 页面绘制
// 获取dom
const doms = {
    audio: document.querySelector('audio'),
    box: document.querySelector('.box'),
    ul: document.querySelector('.box ul')
}

const drawPage = () => {
    // 创建元素片段
    const frag = document.createDocumentFragment();
    for (let i = 0; i < resulr.length; i++) {
        // 创建li标签
        const li = document.createElement('li');
        // 设置li标签的文本内容
        li.textContent = resulr[i].words;
        frag.appendChild(li);
    }
    doms.ul.appendChild(frag);
}
drawPage()

// 找到当前歌词
const findIndex = () => {
    // 播放器当前时间
    const curTime = doms.audio.currentTime;
    for (let i = 0; i < resulr.length; i++) {
        if (curTime < resulr[i].time) {
            return i - 1;
        }
    }
    // 找遍了都没找到（说明播放到最后一句）
    return lrcData.length - 1;
}

// 容器高度
var boxclientHeight = doms.box.clientHeight;

console.log("boxclientHeight", boxclientHeight);
// 每个 li 的高度
var liHeight = doms.ul.children[0].clientHeight;
console.log(liHeight); // 30
// 最大偏移量
var maxOffset = doms.ul.clientHeight - boxclientHeight;
//  最大偏移量 = ul的高度 - 容器高度
//  最大偏移量 = 2160 - 420 = 1740
console.log("最大偏移量", maxOffset);

// 高亮歌词 + 设置ul偏移量
const setOffset = () => {
    let index = findIndex();

    // 
    console.log(index);
    //  30 * 1 + 15 = 45 - 210 = -165
    let offset = liHeight * index + liHeight / 2 - 210;
    console.log(offset);
    if (offset < 0) {
        offset = 0
    }
    if (offset > maxOffset) {
        offset = maxOffset
    }

    doms.ul.style.transform = `translateY(-${offset}px)`;
    console.log(doms.ul.style.transform);
    // 去掉之前的active样式
    let li = doms.ul.querySelector('.active');
    if (li) {
        li.classList.remove('active');
    }
    // 添加active样式
    li = doms.ul.children[index];
    if (li) {
        li.classList.add('active');
    }
}


doms.audio.addEventListener('timeupdate', setOffset);