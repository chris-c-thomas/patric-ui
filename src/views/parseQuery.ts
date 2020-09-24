
import { RQLQuery } from '@swimlane/rql'


type FilterState = {
  parsed: object
  selected: object[],
  byCategory: object,
  keywords: string[]
}

export default function parseQuery(filter: string) : FilterState {
  let _parsed
  try {
    _parsed = RQLQuery.parse(filter)
  } catch (err) {
    console.log('Unable To Parse Query: ', filter)
    return
  }

  let parsed = {
    parsed: _parsed,
    selected: [],
    byCategory: {},
    keywords: []
  }

  function walk(term) {
    switch (term.name) {
    case 'and':
    case 'or':
      term.args.forEach(function (t) {
        walk(t)
      })
      break
    case 'eq':
      var field = decodeURIComponent(term.args[0])
      var value = decodeURIComponent(term.args[1])

      parsed.selected.push({ field, value })

      if (!parsed.byCategory[field]) {
        parsed.byCategory[field] = [value]
      } else {
        parsed.byCategory[field].push(value)
      }

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
