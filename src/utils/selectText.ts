import { openDB } from 'idb'

const DB_NAME = 'highlight-db'
const STORE_NAME = 'highlights'

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
  },
})

function getDomPath(node: Node): string[] {
  const path: string[] = []
  let current: Node | null = node

  while (current && current.nodeType !== 9) {
    const parent = current.parentNode
    if (!parent) break

    const index = Array.from(parent.childNodes).indexOf(current)
    path.unshift(`${(current as HTMLElement).nodeName.toLowerCase()}:nth-child(${index})`)
    current = parent
  }

  return path
}

let currentSelectionData: any = null

export function handleSelection() {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  if (range.collapsed) return

  const startNode = range.startContainer
  const endNode = range.endContainer

  currentSelectionData = {
    text: selection.toString(),
    anchor: {
      path: getDomPath(startNode),
      offset: range.startOffset,
    },
    focus: {
      path: getDomPath(endNode),
      offset: range.endOffset,
    },
  }

  console.log(currentSelectionData)
  handleAction()
}

function highlightRange(range: Range, className = 'highlight') {
  const startNode = range.startContainer
  const endNode = range.endContainer
  const startOffset = range.startOffset
  const endOffset = range.endOffset

  const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => (range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  })

  const textNodes: Text[] = []
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text)
  }

  textNodes.forEach((node) => {
    let nodeStart = 0
    let nodeEnd = node.textContent!.length

    if (node === startNode) nodeStart = startOffset
    if (node === endNode) nodeEnd = endOffset

    const text = node.textContent!
    const before = text.slice(0, nodeStart)
    const middle = text.slice(nodeStart, nodeEnd)
    const after = text.slice(nodeEnd)

    const frag = document.createDocumentFragment()
    if (before) frag.appendChild(document.createTextNode(before))

    const span = document.createElement('span')
    span.className = className
    span.textContent = middle
    frag.appendChild(span)

    if (after) frag.appendChild(document.createTextNode(after))

    node.parentNode?.replaceChild(frag, node)
  })
}

export async function handleAction(type: 'highlight' | 'underline' = 'highlight') {
  if (!currentSelectionData) return

  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  console.log(11)

  const range = selection.getRangeAt(0)
  const className = type === 'highlight' ? 'highlight' : 'underline'
  highlightRange(range, className)
  console.log(99)

  const db = await dbPromise
  await db.add(STORE_NAME, {
    ...currentSelectionData,
    type,
  })

  selection.removeAllRanges()
  currentSelectionData = null
}

function getNodeByDomPath(path: string[]): Node | null {
  let node: Node | null = document
  for (const part of path) {
    const match = part.match(/(\w+):nth-child\((\d+)\)/)
    if (!match || !node) return null
    const [, tag, index] = match
    const idx = parseInt(index, 10)
    const children = Array.from(node.childNodes).filter((n) => n.nodeName.toLowerCase() === tag)
    node = children[idx] || null
  }
  return node
}

export async function restoreAnnotation() {
  const db = await dbPromise
  const all = await db.getAll(STORE_NAME)

  for (const item of all) {
    const startNode = getNodeByDomPath(item.anchor.path)
    const endNode = getNodeByDomPath(item.focus.path)
    if (!startNode || !endNode) continue

    const range = document.createRange()
    range.setStart(startNode, item.anchor.offset)
    range.setEnd(endNode, item.focus.offset)

    highlightRange(range, item.type)
  }
}
