/** 
 * iconfont 字体更新脚本
 * 
 * 前置条件：
 * 将 {
 *      "accessKeyId": "***",
 *      "secretAccessKey": "***"
 *    } 写入到 fe2ci-key.json 中, 才能上传成功
 */

const fs = require('fs')
const path = require('path')
const logger = require('@di-fe/di-cli/utils/logger')
const { getOneLineFromShell } = require('@di-fe/di-cli/utils/cache')
const globby = require('globby')
const fse = require('fs-extra')
const moment = require('dayjs')
const axios = require('axios')

require('isomorphic-fetch')

const loginParams = {
  target: '17721876132',
  password:
    'Bor6DxUWeBnnb6LVg7qMBdkoidSn8tBGM7E4a5l5eV9p6ERUZ2MNfimjDhT5XDwit1fqISNWTkX9A4RrZ1Da1eDXjj+vgML2HZxt4Lz9TQycDwzYLUBpLvtWL8WmKYup5xR2cNEeTf+kgTCXyv7MXD1+a3KtRngvVjULMqgHjpc=',
  'bx-ua': '231!gM08u4mUwmR+j/7kX+73ty/jUA1vSrwUyMX372fegBtt/Weju429lJfxAvqp4HJh3yPrblP8OpfN0+0nJpg2fBCFGX19PdGxcKEvZNfR/c1y9KStMFC3npXb+uLuaYt09LEf9cEV72xwmXd7CAEdIalGNkGhwDcohkwwyFCLedIh4pYdTHQrfpMaH5K9og4ohnIy6bLY56lK6ZnUaWMFCnfkXUTk8y+pUWMzO89AFCiu+1wRyUSSFCmgx0/XLfR4h4++YJPW3koa0Q/oyE+jauHhU1wlLQWGHkE+++3+qCS4+ItZaAXjVIjBo+roPZkSLc2eb9f1x7eVkvMWjgpOJDbvf09DWyKuIqh7lMAWAWHZlQ5534P1UtUzz8OlKuB3WyIqPHkpOerNjpBUOyP56DlI9TRV2JPmtQwAe0KKZ+Ero4CFJQmh1oLEsh2OhPNdEYPOilIuHpGurlS+6U0TLmeQZg+BEXYTrsotSpw9RBYwmP0Y3rxI8NMSL16+Uqjjv6KP9yniBeCJOkrCJ7qUsEtcbhuw2ssIqy9n7e7dRjkMBCtAFq0DkyA286uJfNNasD2JVSIQ6nG2fyBZjGhnPiwz7GzPPiVn3lg67uYUt7BhdUYhz8JWsYIafcMT5kgc5yLkLTRAtbMDgTpCX/iNFK5rtYTcJ6gaJAlvA3w4qWlmc1Bw/DtKoDpS9gUqdt8RhYMzs5gsDl4DFzYhT2Lb9ruqs4sI5MtmwPIbnUA7369rwnB/vom8ZpyNKAihPJfmvMuv6KOSWIGCszYFUQyJl8KKDjllZLvNTzd3MEDM4i4dUuPO0qf2OvCCT1mAi9X9EaOHSSI1uogMlTNh5dW4Iu3ejvVxelbB0X0GqiKldgT/Sg8SVpGQXP8GmhnCL8Z+zGmeW4X0+HiGAhsfclIj1lowoeKbgSDitDBwifMDV9PP/BrlGisg82IXuklhp2/ZJI93WckONgXY1ZiWATiBokjFdKN2DFO7Nm6lYP25VIYp5a3gJqVJRhZ2upGOqZH/c3z/CJBeS9ijbT2N/o99wHAm+elE97usEuCMPU5MspFjQV946blbOMOyOjer8rLMKopi3lbWPk56UVwPIIoIggQboa0+rdmY/wg75qmIwf6szWt37uq6UhdXZOjgKFR80AGtAVN1xcZsjE5R9F12TpGXYiB2l+hZLw6JiicdVKFVgTtAB0t9KLa5281QTJuNPVrAgoxWzb9CN/Ysq2pcoSV4P+s/hAU3VuKaxZ3XqWcegLXivSzgLH8t1ZqBrp3ocGZuyT0WYbtdC9E1RE71keXzWKBwvnAwd6Hc4NMBcvMMvSUN7ETzvPFFSwZew6kqPAQ2vbMJvcOjewoGF20k5CPIf9n5edgnKsiSiDLFnNad1mRGerikMZD8+o4n0VGF8FTeJD+WVT0pvJtf1K6NVmkXf0wyP3RwcDO0hvFrdxEAT/PMHIjvSeWmPLz0lV+FFZ1Jx0N5QB3Don8OnzZwl4OcQw6mWRGZhecTQWvlDVEAfRVLpLmzxlkQbtusfapciAM8i2mlmpJanSXOheMnMecs/+QEB8ZL4J5I11A96Egki57GL4t0QqnO2aaHLgAuwrfUIRTPdhDvPVmlGmuSMA3Xp44lYiw6nlPUyLrwRfo+TTunfhuWfISb/fhoqj9nthrNUHejMU9l2N+oVwCNOpnauIDrK5ijW17gUbT+1gsJ2I2hXImWhqWBQ7T8kQE7z0nvddOStmyN7hKAmTxrSIB1nAGuU1VRbQXTxioh77jIMVRZioj4STHobt6T3IMEZ9yFdo0Y9Am5/ExrT4Ugx/k49riGE1CaNM8Ajg6WfBZoY39u5bvFpQR2ewL9i0UlMwq3aK0WszZKTKoQ2i/OAUdcfrlfHmYyzGXvV9K5jAArmOBl5dhqxPAKAXllHXLgzu6SS7gML1XS0EQvbr7E8utPW172bxOLlfYQSuWKM2FO52XaBCm3cwnk/An9SN7og4Fm+Drlb8FUYjq0WQYTPjGm6qKGtH3lauZCY5kDIPXV9C3btoqhey32e8njcyyUrkx/LCCrKSB3MuQSpvUJGSOwSM50dr2907xpm4/lDRJPBe1cC4tSX3rAvOKifS5NKtgWKy4HE9paTZtf24kfnfwshl2PLxWmQWMeNF9GNrjbiQYVYAl1PWIgZemaGqWOFLPM8nq63nZDrVYXth7lYI2pMsQKLHExWsfYWpkdf+TysgyjqQYbf2tZBHiDrM9fZVTeAMdxgoRoRkVI6TU5sBLtHzoqSnPnHfwalDAJp6OkLF6RNllMf7oHAuogv0VDg4==',
  'bx-umidtoken': 'T2gAT9h7Q3EsMxcoiD5Dc36usUi0WDLpktE3MHfann4d5z6Mhb7QdRnKkIr-I7OSw1A=',
}

const loginBody = Object.entries(loginParams)
  .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
  .join('&')

const matchCToken = (val) => {
  ;/^ctoken=(.*); path/.test(val)
  return RegExp.$1
}

const publicPath = path.join(__dirname, '../public')

const iconFontPath = path.join(publicPath, 'iconfont.zip')

// 登录
async function login() {
  try {
    const res = await fetch('https://www.iconfont.cn/api/account/login.json', {
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7,ja;q=0.6',
        'bx-v': '2.5.31',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        origin: 'https://www.iconfont.cn',
        priority: 'u=1, i',
        referer: 'https://www.iconfont.cn/login?spm=a313x.home_2025.i3.34.58a33a81IIg4YB',
        'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        'x-csrf-token': null,
        'x-requested-with': 'XMLHttpRequest',
        cookie: 'locale=zh-cn; cna=ecEyITJCvWoCAXToUULnQdZg; u=5455273; u.sig=i7Zcv78oF1RpaDHGa3AfpsuVz95PmsJXlwnGx5hG4BI; xlly_s=1; EGG_SESS_ICONFONT=bDK7OJozMkeHlL1IV6mic3nsp-5gh0MDngHoinvXVyoj4DLev3N-GfbiuPvMEQBuq_5OPLawxEgyIfJBmsq3_1V_78lTvjaDTwsJcdSCkBw=; tfstk=gHx-pIaebxe-wpPzeB0mx8la7MMmsqvyqQJ_x6fuRIdvCdPlRUcy9ed9gwqHdb8pMIR2ZLvHvErpQp-oUMDP4LSFAfcijHpyUM7Qbrk22SZfLKa7R9gcc1MdUkhijcvSPTSHhfxhCBKRG9sCFw65cxBhdysQVkMAG9BaR7OCAxHAEO4QRzZ5Gr1VdM6WOMMAcsWhA6OCAxpj6wldG813vUttkojSEVrLvnBRy6EhGkQwclb51jfbvkCReaUkFsEQAnLqjnrh6mFfip9wRZKK4ujenFdpRIMQA6LfBCBMZmZRAEOvXN9q6u5JlQ-dqNoLptL9hQKRvVePn3pXbwKrwo1JgKTG4hG4vC9DI372vfFfTUXNcTLxdr15RgW2jhpWh5fOKzMxHyzFPt5OPY7pquK4otCieDUU8Zk4xzKp9yaQ_EWAsxY08y7q3',
      },
      body: loginBody,
      method: 'POST',
      mode: 'cors',
    })
    let cookie = res.headers.get('set-cookie')
    if (!cookie) {
      throw new Error('登录失败：token获取失败')
    }
    const cToken = matchCToken(cookie)
    logger.info(`登陆成功 cToken: `, cToken)
    return cToken
  } catch (e) {
    logger.error(e.message || '登录失败')
    process.exit(1)
  }
}

async function findUntarPackageName() {
  const paths = await globby(`${publicPath}/font_*/iconfont.js`)
  if (!paths.length) {
    throw new Error('未匹配到iconfont.js文件')
  }
  return paths[0]
}

const params = {
  spm: 'a313x.manage_type_myprojects.i1.d7543c303.aaac3a81x14lON',
  // projectId
  pid: '4997956',
}

const downloadUrl = 'https://www.iconfont.cn/api/project/download.zip'

const createWritePromise = (dest, data) => {
  data.pipe(dest)
  return new Promise((res, rej) => {
    dest.on('close', () => {
      res()
    })
    dest.on('error', rej)
  })
}

// 下载
async function downloadIconFontJSFile(cToken) {
  const downloadParams = Object.entries({
    ...params,
    cToken,
  })
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  try {
    const res = await axios.get(`${downloadUrl}?${downloadParams}`, {
      responseType: 'stream',
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'zh-CN,zh;q=0.9',
        'bx-v': '2.2.3',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'upgrade-insecure-requests': '1',
        cookie:
          'cna=ulkmHyodWmYCAbSfTE2JUAF/; locale=zh-cn; ctoken=7FLuEU_u0lpxlU2FuIv6qfpp; xlly_s=1; EGG_SESS_ICONFONT=dzIFRF6UFHpWicZx2_bPcjQYMuoeIuyUBDeEb8lxqGiUnmNfD-luSKZIEy-Ts5QEn6jzUQZVaR3Jc7K9oSGuB_yXAla8YSIYxawmQgUUryqO7elvt91ynAfUbRAIhQmT; u=5455273; u.sig=i7Zcv78oF1RpaDHGa3AfpsuVz95PmsJXlwnGx5hG4BI; tfstk=g9rnfMb9hfObZLxB-TmCRMWE0W7OADiSg7K-w0hP7fl69BKLUgcu_5U-98h8SbVi12BQewOkqfPnyuBB2pa_M--LvwiJqDiS4sCADipQd0iPktA_OBOZhYj-U0-EAcPwGpQGDieQLpHFHRSY23nJEYGr42urQAlseYkra7Sw7fMSUBkyYO2Z1fke4Xly_GkxEekza0WgQfMD40uUacWiFflr40lth3l04lZNZaVDumnySlkn-jyETJeLb6gyRRGguzZIKR08LUty4lDn-udbDJe-4yyLsqUhiHmYLrNS3WRFtAq3nu44_GKnqRz4qcrN_dhUlRqovkWRYcr3tkugaLYi8rNLuVqOthG47R2-SP6WJbUjU7gb2stIT8ybcrncqLDgoRoG4jLwuMivVAW8bUTS8AMiMt3WwMek-WKfIOYfR2kspsERIF9WG3-8DOXMuYgECvCA.',
        Referer:
          'https://www.iconfont.cn/manage/index?spm=a313x.home_2025.i3.22.58a33a81fEPkCb&manage_type=myprojects&projectId=2755933',
        'Referrer-Policy': 'no-referrer-when-downgrade',
      },
    })
    if (res.status !== 200) throw new Error('资源异常')
    const dest = fs.createWriteStream(iconFontPath)
    await createWritePromise(dest, res.data)
    await getOneLineFromShell('tar', ['-xvf', iconFontPath, '-C', publicPath])
    logger.info('解压成功')
    const iconfontFilePath = await findUntarPackageName()
    return iconfontFilePath
  } catch (e) {
    logger.error(e.message || '下载失败')
    process.exit(1)
  }
}

// 上传
async function uploadIconFontJSFile(filePath) {
  const uploadedUrl = await getOneLineFromShell('npx', [
    'di-cli',
    'uploadFile',
    `--source=${filePath}`,
    `--alias=iconfont-${moment().format('YYYYMMDD-HHmmss')}.js`,
    '--project=TianOS-H5',
  ])
  return uploadedUrl[3]?.trim()?.replace(/'/g, '')
}


async function clean() {
  fse.removeSync(path.join(publicPath, 'iconfont.zip'))
  const paths = await globby(`${publicPath}/font_*/iconfont.js`)
  await Promise.all(
    paths
      .map((item) => item.split('/').slice(-2)[0])
      .map((item) => {
        fse.removeSync(path.join(publicPath, item))
      }),
  )
  logger.info('中间产物删除成功')
}

const targetUsedFilePath = path.join(__dirname, '../src', 'components/CIcon/index.tsx')
// 替换
async function replaceIconFont(remoteUrl = 'zc') {
  const res = fse.readFileSync(targetUsedFilePath, 'utf-8')
  const matches = res.match(/http(.*)js/)
  if (!matches || !matches.length) {
    await clean()
    throw new Error('未匹配到老的iconfont链接')
  }
  fse.writeFileSync(targetUsedFilePath, res.replace(matches[0], remoteUrl))
}

async function main() {
  const cToken = await login()
  const filePath = await downloadIconFontJSFile(cToken)
  const remoteUrl = await uploadIconFontJSFile(filePath)
  await replaceIconFont(remoteUrl)
  await clean()
}

main()
  .then(() => {})
  .catch((err) => {
    logger.error(err.message, 'error')
    process.exit(1)
  })
