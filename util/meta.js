
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
