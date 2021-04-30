import { b2b } from './base'

export const b2bQuery = async (params) => {
  const result = await b2b
    .get('/api/squat-service/b2b_thesaurus/query')
    .query(params)
    .json()
  return result.data
}
