import { useEffect, useState } from 'react'
import useAuth from './useAuth'
import useAxios from './useAxios'

const useUserRole = () => {
  const { user } = useAuth()
  const axios = useAxios()
  const [role, setRole] = useState('user')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchRole = async () => {
      try {
        if (!user?.email) {
          if (isMounted) {
            setRole('user')
            setLoading(false)
          }
          return
        }
        const res = await axios.get('/api/users')
        const found = Array.isArray(res.data?.data)
          ? res.data.data.find(u => u.email === user.email)
          : null
        if (isMounted) {
          setRole(found?.role || 'user')
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setRole('user')
          setLoading(false)
        }
      }
    }
    fetchRole()
    return () => { isMounted = false }
  }, [user?.email, axios])

  return { role, loading }
}

export default useUserRole
