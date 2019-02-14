const { optimize } = require('./lib/optimizer')
const { parse } = require('./lib/parser')
const { transform } = require('./lib/transformer')

/**
 * Transform and optimize SVG to valid React SVG
 * @param {String} svg - the svg string
 */
const svg2jsx = (svg, options = {}) => {

  return optimize(svg)
    .then(parse)
    .then((ast) => transform(ast, options))

}
	
module.exports = svg2jsx
