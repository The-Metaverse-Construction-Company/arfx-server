export const successReponse = (data: any) => {
  return {
    success: true,
    result: data,
    errors: []
  }
}

export const errorResponse = (error: any) => {
  return {
    success: true,
    result: null,
    errors: error
  }
}