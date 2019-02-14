const flow = require('lodash.flow')
const camelize = require('camel-case')
const reactify = require('css-to-react-native').default
const { stringify, parseStyle } = require('./parser')

/**
 * Transform CSS to inline React CSS
 * @param {String} css - the css string
 */
const transformStyle = flow(
  parseStyle,
  reactify
)

/**
 * @constant
 */
const CUSTOM_ATTRIBUTES = {
  class: 'className'
}

/**
 * @constant
 */
const CUSTOM_VALUES = {
  style: transformStyle
}

/**
 * Traverse AST and apply transformation
 * @param {Object} ast - the SVG syntax tree
 */
const traverse = ast => {

  return ast.map(node => {

    const attributes = {}

    // transform attributes
    // and values
    for (let attr in node.attributes) {

      const value = node.attributes[attr]
      const isDataAttr = attr.startsWith('data-')
      // data-attr don't change anything
      // else check if is a custom attribute and apply transform
      const modifiedAttr = isDataAttr ? attr : CUSTOM_ATTRIBUTES[attr] || camelize(attr)
      const modifiedValue = CUSTOM_VALUES[attr] ? CUSTOM_VALUES[attr](value) : value

      attributes[modifiedAttr] = modifiedValue

    }

    // set transformed attributes
    node.attributes = attributes

    // traverse childrens
    if (node.children.length) traverse(node.children)

    // return modified node
    return node

  })

}

/**
 * Transform AST to React JSX string
 * @param {Object} ast
 */
const transform = (ast, options) => {

  return flow([traverse, (ast) => stringify(ast, options)])(ast)
  
}

module.exports = {
  transform
}
