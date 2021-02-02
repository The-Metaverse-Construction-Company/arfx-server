export const successReponse = (data: any) => {
  return {
    success: true,
    result: data,
    error: null
  }
}

export const errorResponse = (error: any) => {
  return {
    success: true,
    result: null,
    error: error
  }
}