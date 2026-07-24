/**
 * Minimal Destiny Matrix number calculator (mirrors app/matrix/index.js calculateNumbers).
 * Kept local so sanity scrape tooling does not depend on app path aliases.
 */

export function processNum(num) {
  let processedNum = num
  while (processedNum > 22) {
    let sum = 0
    for (const digit of String(processedNum)) sum += Number.parseInt(digit, 10)
    processedNum = sum
  }
  return processedNum
}

export function processGroup(nums) {
  return processNum(nums.reduce((acc, curr) => acc + curr, 0))
}

/**
 * @param {string} dateStr YYYY-MM-DD
 * @returns {Record<string, number | number[]>}
 */
export function calculateMatrixNumbers(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  if (!y || !m || !d) throw new Error(`Invalid date: ${dateStr}`)

  const a = processNum(d)
  const b = processNum(m)
  const a8 = processNum(y)
  const b6 = processGroup([a, b, a8])
  const g = processGroup([a, b, a8, b6])

  const a6 = processGroup([g + a8])
  const a7 = processGroup([a6, a8])
  const b4 = processGroup([g, b6])
  const b5 = processGroup([b6, b4])

  const cornerD = processGroup([a, b])
  const c5 = processGroup([b, a8])
  const d6 = processGroup([a8, b6])
  const c = processGroup([b6, a])

  const b2 = processGroup([b, g])
  const b3 = processGroup([b2, g])
  const b1 = processGroup([b2, b])

  const d3 = processGroup([b4, a6])
  const d4 = processGroup([g, d6])
  const d5 = processGroup([d4, d6])

  const d2 = processGroup([cornerD, g])
  const d1 = processGroup([d2, cornerD])

  const c3 = processGroup([c5, g])
  const c4 = processGroup([c3, c5])
  const c2 = processGroup([c, g])
  const c1 = processGroup([c2, c])

  const l = processGroup([d3, b4])
  const money = processGroup([d3, a6])

  const a2 = processGroup([a, g])
  const a1 = processGroup([a2, a])
  const a3 = processGroup([g, a2])

  const sky = processGroup([b, b6])
  const earth = processGroup([a, a8])
  const purposeResult = processGroup([sky, earth])

  const socialM = processGroup([cornerD, d6])
  const socialF = processGroup([c, c5])
  const socialResult = processGroup([socialM, socialF])

  const spiritualHarmony = processGroup([socialResult, purposeResult])

  return {
    a,
    b,
    a1,
    a2,
    a3,
    a6,
    a7,
    a8,
    b1,
    b2,
    b3,
    b4,
    b5,
    b6,
    g,
    d: cornerD,
    d1,
    d2,
    d3,
    d4,
    d5,
    d6,
    c,
    c1,
    c2,
    c3,
    c4,
    c5,
    l,
    m: money,
    'purpose.sky': sky,
    'purpose.earth': earth,
    'purpose.result': purposeResult,
    'socialization.m': socialM,
    'socialization.f': socialF,
    'socialization.result': socialResult,
    spiritualHarmony,
    square: [cornerD, d6, c5, c],
  }
}

/**
 * Resolve a position-calc-map entry against calculated numbers.
 * @returns {number | number[] | null}
 */
export function resolveCalcValue(numbers, positionDef) {
  if (!positionDef) return null
  if (positionDef.calcPathKind === 'array' && Array.isArray(positionDef.arrayPaths)) {
    return positionDef.arrayPaths.map((p) => numbers[p]).filter((v) => typeof v === 'number')
  }
  if (!positionDef.calcPath) return null
  const v = numbers[positionDef.calcPath]
  return typeof v === 'number' || Array.isArray(v) ? v : null
}
