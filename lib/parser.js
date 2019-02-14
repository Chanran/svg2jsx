const parser = require('svg-parser')
const isPlainObject = require('is-plain-object')

/**
 * Stringify style
 * @param {Object} css - style proprieties
 */
const stringifyStyle = css => {

  const style = []

  for (let propriety in css) {

    style.push(`${propriety}: ${css[propriety]}`)
    
  }

  return style.join(', ')

}

/**
 * Stringify attributes
 * @param {Object} attributes - the node attributes
 */
const stringifyAttrs = attrs => {

  const attributes = []

  for (let attr in attrs) {

    const value = attrs[attr]
    const modifiedValue = isPlainObject(value) ? `{{ ${stringifyStyle(value)} }}` : `"${value}"`

    attributes.push(`${attr}=${modifiedValue}`)

  }

  return attributes.length ? attributes.join(' ') : ''

}

const firstUpperCase = (str) => {

  return str.replace(/\b(\w)(\w*)/g, ($0, $1, $2) => {
    
    return $1.toUpperCase() + $2

  })

}

/**
 * Stringify node
 * @param {Object} node - the node
 */
const stringifyNode = (buffer, node, isFirstUpperCase) => {
  
  const isParent = node.children.length
  const attributes = stringifyAttrs(node.attributes)

  let element = ''

  if (isFirstUpperCase) {

    element = buffer + `<${firstUpperCase(node.name)} ${attributes}` + (isParent ? '>' : '/>')
    
  } else {
    
    element = buffer + `<${node.name} ${attributes}` + (isParent ? '>' : '/>')

  }
  

  if (isParent) {

    const childrens = node.children.reduce((buffer, node) => stringifyNode(buffer, node, isFirstUpperCase), '')


    let returnString = ''

    if (isFirstUpperCase) {

      returnString = element + childrens + `</${firstUpperCase(node.name)}>`

    } else {

      returnString = element + childrens + `</${node.name}>`

    }

    return returnString

  }

  return element

}

/**
 * Stringify AST
 * @param {Object} ast - the SVG ast
 */
const stringify = (ast, options) => {

  let isFirstUpperCase = false

  if (options && options.isFirstUpperCase) {
    
    isFirstUpperCase = true
    
  }
  
  return ast.reduce((accumulator, node) =>
    accumulator + stringifyNode('', node, isFirstUpperCase), '')

}

/**
 * Parse CSS
 * @param {String} css - the css string
 */
const parseStyle = css => {

  return css
    .replace(/\s/g, '')
    .split(';')
    .map(group => group.split(':'))
    .filter(([ prop ]) => prop)
    
}

/**
 * Parse SVG
 * @param {String} svg - the SVG string
 */
const parse = svg => [parser.parse(svg)]

module.exports = {
  stringify,
  parse,
  parseStyle
}
