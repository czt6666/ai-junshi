export const longText = `
# Markdown 渲染测试

## 1. 标题与文本
这是一个示例文档，用于测试各种 Markdown 渲染情况，包括代码块、链接、图片和长文本。

## 2. 代码块测试

### JavaScript 代码
\`\`\`javascript
function longFunctionName() {
    console.log("This is a very long line of JavaScript code to test the wrapping functionality and ensure that it renders correctly in the output without breaking anything important.");
}
\`\`\`

### Python 代码
\`\`\`python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        print(a, end=' -> ')
        a, b = b, a + b
    return a
\`\`\`

### HTML 代码
\`\`\`html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>测试页面</title>
</head>
<body>
    <h1>你好，Markdown 渲染器！</h1>
    <p>这是一个包含超链接、图片和代码块的长文本测试。</p>
</body>
</html>
\`\`\`

## 3. 代码内联测试
可以使用 \`console.log('Hello, World!');\` 进行内联代码高亮测试。

## 4. 超链接测试
[访问Google](https://www.google.com) 以获取更多信息。

## 5. 图片测试
![示例图片](https://foruda.gitee.com/avatar/1741710135231857559/10585760_czt666_cn_1741710135.png!avatar200)

## 6. 长文本测试

这是一个用于测试长文本的段落，我们要确保这个 Markdown 渲染器能够正确解析并显示长文本。
这里有一些特殊字符：!@#$%^&*()_+-=[]{}|;:'",.<>?/\n

这是一整行没有换行的长文本：
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet suscipit urna. Curabitur quis justo erat. Vestibulum ut erat at ex consectetur tincidunt ut at est. Integer posuere quam ut ligula malesuada, ac condimentum orci fermentum.

## 列表测试
- 项目1
- 项目2
- 项目3

1. 项目1
2. 项目2
3. 项目3

## 7. 表格测试
| 项目 | 描述 |
| --- | --- |
| 项目1 | 这是项目1的描述 |
| 项目2 | 这是项目2的描述 |


123
[end]
`
