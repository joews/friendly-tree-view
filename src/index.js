/* eslint-env browser */

// TODO
// * base classname option
// * BEM util
// * datum href property
// * onClick, onOpen, onClose events
// * more keyboard shortcuts
// * configurable ids (`${prefix}-${instanceNum}-${nodeNum}`)

export default function treeView (data) {
  if (new.target) {
    console.warn('treeView should not be called as a constructor')
  }

  const view = Object.create(TreeView)
  Object.assign(view, { data })

  return view
}

// a sequential integer used to generate unique ids for form elements
let nextId = 1

const TreeView = {
  render (containerOrSelector) {
    const container = (containerOrSelector instanceof HTMLElement)
      ? containerOrSelector
      : document.querySelector(containerOrSelector)

    if (container == null) {
      throw new TypeError('the first argument to `treeView` must be a DOM node or a selector string')
    }

    const el = this._renderList(this.data, 'TreeView')
    container.appendChild(el)

    return this
  },

  _renderChild (datum) {
    const el = node('li', 'TreeView__node')

    if (datum.children) {
      const id = `friendly-tree-view_${nextId++}`
      const inputEl = node('input', 'TreeView__input')
      inputEl.id = id
      inputEl.type = 'checkbox'
      el.appendChild(inputEl)

      const caption = node('label', 'TreeView__caption TreeView__caption--branch')
      caption.htmlFor = id
      caption.textContent = datum.label
      el.appendChild(caption)

      const childrenEl = this._renderList(datum.children)
      el.appendChild(childrenEl)
    } else {
      // TODO render a label or span when the datum doesn't have a href
      const caption = node('a', 'TreeView__caption')
      caption.textContent = datum.label
      // TODO check if datum has a `href`
      caption.href = '#' + datum.label
      el.appendChild(caption)
    }

    return el
  },

  _renderList (data, className = 'TreeView__branch') {
    const list = node('ul', className)
    data.forEach(d => {
      list.appendChild(this._renderChild(d))
    })

    return list
  }
}

function node (tagName, className) {
  const el = document.createElement(tagName)
  el.className = className

  return el
}
