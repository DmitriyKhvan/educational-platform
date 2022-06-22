import { createContext, useState } from 'react'

export const AvailProv = createContext()

export const AvailabilityProvider = ({
  children,
  gatherAvailabilities,
  setGatherAvailabilities
}) => {
  const [availabilityRow, setAvailabilityRow] = useState([])

  const removeAvailabilityRow = ({ id, day }) => {
    if (id) {
      setAvailabilityRow(availabilityRow =>
        availabilityRow.filter(q => q.id !== id)
      )
      setGatherAvailabilities(gatherAvailabilities.filter(q => q.id !== id))
    }
  }

  return (
    <AvailProv.Provider
      value={{
        availabilityRow,
        setAvailabilityRow,
        removeAvailabilityRow
      }}
    >
      {children}
    </AvailProv.Provider>
  )
}
