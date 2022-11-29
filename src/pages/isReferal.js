import React from 'react'
import { useHistory, useParams } from 'react-router-dom'

const IsReferal = () => {
  const {referalcode} = useParams();
  const history = useHistory()
  
  React.useEffect(() => {
    if(!localStorage.getItem("referalcode")) {
      localStorage.setItem("referalcode", referalcode)
    } else {
      history.push("/signup")
    }
  }, [referalcode])

  return (
    <></>
  )
}

export default IsReferal;
