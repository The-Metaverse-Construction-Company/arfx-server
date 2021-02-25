export const successReponse = (data: any) => {
  return {
    success: true,
    result: data,
    errors: []
  }
}

export const errorResponse = (error: any) => {
  return {
    success: false,
    result: null,
    errors: error
  }
}