import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.min.css'
import './index.css'

interface MarkdownRendererOptions {
  breakCode?: boolean
  colorfulCode?: boolean
}

// const ops = {
//   scrollPanel: {
//     scrollingX: true,
//     scrollingY: true,
//     speed: 300,
//   },
//   bar: {
//     keepShow: true,
//     background: '#c1c1c1',
//   },
// }

class MarkdownRenderer {
  private md: MarkdownIt
  private breakCode: boolean
  private colorfulCode: boolean

  constructor(options: MarkdownRendererOptions = {}) {
    this.breakCode = options.breakCode ?? false
    this.colorfulCode = options.colorfulCode ?? true

    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      breaks: true,
      langPrefix: 'hljs language-',
      highlight: (str: string, lang: string): string => {
        if (this.colorfulCode && lang && hljs.getLanguage(lang)) {
          try {
            return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
          } catch (e) {
            console.warn('Highlight error:', e)
          }
        }
        return `<pre class="hljs"><code>${this.md.utils.escapeHtml(str)}</code></pre>`
      },
    })
  }

  /**
   * 渲染 Markdown 字符串为 HTML
   * @param markdownText - 需要转换的 Markdown 文本
   * @returns 生成的 HTML 字符串
   */
  render(markdownText: string): string {
    const html = this.md.render(markdownText)
    return this.postProcessing(html)
  }

  /**
   * 对 HTML 做后处理，添加链接、图片、滚动等结构
   * @param html - 生成的 HTML
   * @returns 处理后的 HTML
   */
  private postProcessing(html: string): string {
    const wrapper = document.createElement('div')
    wrapper.className = 'mrd-wrapper'
    wrapper.innerHTML = html

    // 新标签打开链接
    wrapper.querySelectorAll('a').forEach((a) => {
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
    })

    // 响应式图片
    wrapper.querySelectorAll('img').forEach((img) => {
      img.setAttribute('style', 'max-width: 100%; height: auto;')
    })

    // 可选：打断 pre 元素
    if (this.breakCode) {
      wrapper.querySelectorAll('pre').forEach((pre) => {
        const div = document.createElement('div')
        div.innerHTML = pre.innerHTML
        pre.replaceWith(div)
      })
    }

    // vue-scroll 包装代码块
    // wrapper.querySelectorAll('pre').forEach((preBlock) => {
    //   const vueScroll = document.createElement('vue-scroll')
    //   vueScroll.setAttribute(':ops', JSON.stringify(ops))
    //   const codeBlock = preBlock.querySelector('code')

    //   if (codeBlock) {
    //     vueScroll.appendChild(codeBlock)
    //     preBlock.innerHTML = ''
    //     preBlock.appendChild(vueScroll)
    //   }
    // })

    return wrapper.outerHTML
  }
}

export default MarkdownRenderer
