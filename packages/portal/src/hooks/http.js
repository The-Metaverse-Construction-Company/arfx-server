// import React, {useEffect, useState} from 'react'

// import http from 'axios'
// export default ({
//   url,
//   data,
//   method,
// }, dependencies = []) => {
//   const [isLoading, setIsLoading] = useState(false)
//   const [httpResponse, setHttpResponse] = useState(null)
//   useEffect(() => {
//     setIsLoading(true)
//     http({
//       url,
//       data,
//       method,
//     })
//     .then((response) => {
//       setIsLoading(false)
//       setHttpResponse(response.data)
//       return response.data
//     })
//     .catch(err => {
//       setIsLoading(false)
//       console.log('err :>> ', err);
//     })
//   }, dependencies)
//   return {data: httpResponse, isLoading}
// }