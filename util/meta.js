
const isArray = Array.isArray

export function filterCategories(allCategories, categories = []) {
  if (categories.length === 0) {
    return []
  }
  // 目前: category 仅两级
  return allCategories
    .filter(c => categories.includes(c.name) || categories.includes(c.parent))
    .map(c => ({...c}))
}

export function filterAreas(allAreas, areas = []) {
  if (areas.length === 0) {
    return []
  }

  return allAreas
    .filter(a => {
      if (a.areaType === 0 || a.areaType === 2) {
        // 全国, 省
        return areas.includes(a.name)
      }

      if (a.areaType === 1) {
        // 市 (包括直辖市)
        return areas.includes(a.name) || areas.includes(a.parent)
      }
    })
    .map(a => ({...a}))
}

export function getCategoryParent(allCategories, name) {
  // 目前: 层级仅 2 层
  let result = ''

  allCategories.forEach(c => {
    if (c.name === name) {
      result = c.belongsToFirst || c.belongsToSecond
    }
  })

  return result
}

export function getAreaParent(allAreas, name) {
  let result = ''

  allAreas.forEach(a => {
    if (a.name === name) {
      result = a.parent
    }
  })

  return result
}

/**
 * 仅用于 区域 类目
 * @params {String} name
 * @params {Array} allItems
 *
 * @returns {String}
 */
export function getCnName(name, allItems) {
  let result = name

  allItems.forEach(i => {
    if (i.name === name) {
      if (i.nameCn) {
        result = i.nameCn
      }
    }
  })

  return result
}

export function formatCategoriesOrAreas(names, allItems) {
  if (!isArray(names)) {
    return '无'
  }

  return names.map(c => {
    return getCnName(c, allItems)
  }).join(', ')
}
