import React, { useEffect, useState } from 'react'
import assitanceService from 'services/assistances'

const AdminSessionShow = ({ match }) => {
  const sessionId = match.params.id
  const [isLoading, setIsLoading] = useState(true)
  const [assistances, setAssistances] = useState([])

  useEffect(() => {
    const fetchAssistances = async () => {
      try {
        const data = await assitanceService.getAll(sessionId)
        console.log(data)

        setAssistances(data)
      } catch (e) {
        console.log(e)
      }
    }

    fetchAssistances()
  }, [])

  return 'Hola Mundo'
}

export default AdminSessionShow
