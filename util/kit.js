
export function getPagination(total, offset, limit) {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPage = Math.ceil(total / limit)

  return {
    currentPage,
    totalPage,
    limit,
    total
  }
}

// 仅用于 区域 类目
export function getCnName(item, allItems) {

}
