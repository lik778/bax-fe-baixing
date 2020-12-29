export function getUniqueAgreementList (vendorList) {
  const agreementList = []
  vendorList
    .reduce((list, { selection }) => {
      const skuAgreementList = selection.reduce((list, { agreement }) => {
        return list.concat([{ ...agreement, checked: false }])
      }, [])
      return list.concat(skuAgreementList)
    }, [])
    .forEach(agreement => {
      if (!agreementList.find(o => o.id === agreement.id)) {
        agreementList.push(agreement)
      }
    })
  return agreementList
}
