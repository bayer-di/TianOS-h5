/**
 * 自定义rem适配方案，增加最大宽度限制
 * 基于amfe-flexible修改，增加了对大屏幕的处理
 */

// 设计稿宽度
const DESIGN_WIDTH = 395
// 最大宽度限制，超过这个宽度不再等比放大
const MAX_WIDTH = 750

export function setRem() {
  const docEl = document.documentElement
  const dpr = window.devicePixelRatio || 1
  
  // 设置data-dpr属性
  docEl.setAttribute('data-dpr', dpr.toString())
  
  // 计算rem基准值
  const refreshRem = () => {
    let width = docEl.clientWidth
    
    // 横屏和大屏幕处理：限制最大宽度
    if (width > MAX_WIDTH) {
      width = MAX_WIDTH
    }
    
    // 将窗口宽度分成10份，1份为1rem
    const rem = width / 10
    docEl.style.fontSize = rem + 'px'
  }
  
  // 初始化
  refreshRem()
  
  // 窗口变化时重新计算
  window.addEventListener('resize', refreshRem)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      refreshRem()
    }
  })
  
  // 设置viewport
  if (dpr >= 2) {
    const viewportEl = document.querySelector('meta[name="viewport"]')
    if (viewportEl) {
      viewportEl.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover')
    }
  }
}

export default setRem
