// Referring to https://github.com/egoist/front-matter
// © egoist, Released under the MIT License.

export default (str: string, delimiter = '---') => {
  if (!str && str !== '') {
    throw new TypeError('Expect str to be a string!')
  }

  str = str.trim()

  const RE = new RegExp(`^${delimiter}\\n+([\\s\\S]+)\\n+${delimiter}(?:\\n([\\s\\S]*))?$`)

  const splits = str.split('\n')
  const unmatchResult = {
    body: str,
    head: ''
  }
  if (!splits[0] || splits[0] !== delimiter || !RE.test(str)) {
    return unmatchResult
  }

  const [, head, body] = RE.exec(str)!
  return {
    head,
    body
  }
}
