export const fetchUrl = async (url, options) => {
  try {
    /* global fetch */
    const res = await fetch(url, options)
    if (res.ok) {
      if(res.status === 204) {
        const data = await res.text()
        return data
      } else {
        const data = await res.json()
        return data
      }
      
    } else {
      const err = await res.text()
      throw new Error(err)
    }
  } catch (err) {
    throw new Error((typeof err === 'string' && err) || err.message || 'Something went wrong!')
  }
}
