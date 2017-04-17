
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
