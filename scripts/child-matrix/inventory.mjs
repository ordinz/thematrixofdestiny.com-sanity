/**
 * Shared interpretation inventory helpers for pick-dates / coverage.
 */

export const POS_ID_TO_KEY = {
  'position.child.personality.outer-character': 'outer-character',
  'position.child.personality.sky-character': 'sky-character',
  'position.child.personality.main-character': 'outer-character',
  'position.child.innate-talents.personal': 'personal-talents',
  'position.child.innate-talents.father-line': 'father-line-talents',
  'position.child.innate-talents.mother-line': 'mother-line-talents',
  'position.child.innate-talents.self-realization': 'self-realization-direction',
  'position.child.parent-relationship.generation-1': 'generation-1',
  'position.child.parent-relationship.generation-2': 'generation-2',
  'position.child.parent-relationship.generation-3': 'generation-3',
  'position.child.parenting-guidance.father': 'father-guidance',
  'position.child.parenting-guidance.mother': 'mother-guidance',
  'position.child.ancestral-programs.line': 'ancestral-line',
  'position.child.personal-purpose.earth': 'earth-purpose',
  'position.child.personal-purpose.heaven': 'heaven-purpose',
  'position.child.personal-purpose.result': 'personal-result',
  'position.child.social-purpose.male': 'social-male',
  'position.child.social-purpose.female': 'social-female',
  'position.child.social-purpose.result': 'social-result',
  'position.child.spiritual-purpose.main': 'spiritual-main',
}

export function tupleKey(positionKey, arcana) {
  return `${positionKey}:${arcana}`
}

/**
 * Soft predictors for positions without a locked calcPath.
 * Any candidate path that matches a missing arcana counts as a weak hit.
 */
export const SOFT_CANDIDATES = {
  'father-line-talents': ['d3', 'd1', 'c1', 'a7', 'purpose.sky'],
  'mother-line-talents': ['d5', 'd1', 'c1', 'c', 'l', 'a6'],
  'father-guidance': ['c1', 'a3', 'purpose.result', 'a7', 'a1'],
  'mother-guidance': ['l', 'c2', 'a6', 'b', 'c3'],
  'self-realization-direction': ['b2', 'd3', 'd1', 'c1'],
}

export function loadHaveSet(inventoryPath, {fs}) {
  const have = new Set()
  if (!inventoryPath || !fs.existsSync(inventoryPath)) return have
  for (const line of fs.readFileSync(inventoryPath, 'utf8').split(/\n/)) {
    if (!line.trim()) continue
    const doc = JSON.parse(line)
    const key = POS_ID_TO_KEY[doc.position?._ref] || doc._positionKey
    if (!key || !doc.arcanaNumber) continue
    have.add(tupleKey(key, doc.arcanaNumber))
  }
  return have
}

export function loadHaveMap(inventoryPath, {fs}) {
  const have = new Map()
  if (!inventoryPath || !fs.existsSync(inventoryPath)) return have
  for (const line of fs.readFileSync(inventoryPath, 'utf8').split(/\n/)) {
    if (!line.trim()) continue
    const doc = JSON.parse(line)
    const key = POS_ID_TO_KEY[doc.position?._ref] || doc._positionKey
    if (!key || !doc.arcanaNumber) continue
    if (!have.has(key)) have.set(key, new Set())
    have.get(key).add(doc.arcanaNumber)
  }
  return have
}
