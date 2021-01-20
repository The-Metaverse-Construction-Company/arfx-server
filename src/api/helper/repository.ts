
export const generateSearchTextFields = (fields: string[], searchText: string = '') => {
  return (fields.length >= 1 ? fields : []).map((field: string) => ({[field]: {
    $regex: new RegExp(searchText, 'gi')
  }}))
}