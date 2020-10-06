
import { RQLQuery } from '@swimlane/rql'


type FilterState = {
  parsed?: object
  byCategory: object
  range: object
  keywords: string[]
}

export default function parseQuery(filter: string) : FilterState{

  let _parsed
  try {
    _parsed = RQLQuery.parse(filter)
  } catch (err) {
    return {
      byCategory: {},
      keywords: [],
      range: {}
    }
  }

  let parsed = {
    parsed: _parsed,
    byCategory: {},
    keywords: [],
    range: {}
  }


  let field, value
  let min = '',
    max = ''

  function walk(term) {
    switch (term.name) {
    case 'and':
    case 'or':
      term.args.forEach(function (t) {
        walk(t)
      })
      break
    case 'eq':
      field = decodeURIComponent(term.args[0])
      value = decodeURIComponent(term.args[1])

      if (!parsed.byCategory[field]) {
        parsed.byCategory[field] = [value]
      } else {
        parsed.byCategory[field].push(value)
      }

      break
    case 'gt':
    case 'lt':
    case 'between':
      field = decodeURIComponent(term.args[0])

      if (term.name == 'gt')
        min = decodeURIComponent(term.args[1])
      else if (term.name == 'lt')
        max = decodeURIComponent(term.args[1])
      else if (term.name == 'between')
        [min, max] = [decodeURIComponent(term.args[1]), decodeURIComponent(term.args[2])]
      else
        throw 'parseQuery: no condition found for `gt`, `lt`, or `between`'

      parsed.range[field] = {min, max}

      break
    case 'keyword':
      parsed.keywords.push(term.args[0])
      break
    default:
      console.log('Skipping Unused term: ', term.name, term.args)
    }
  }

  walk(_parsed)

  return parsed

}
