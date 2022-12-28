import React, { useContext } from 'react'
import { SocketContext } from '@utils/SocketContext'

export const Notification = React.memo(() => {
  const { answerCall, call, callStatus } = useContext(SocketContext)
  return (
    <>
      {call.isReceivedCall && !callStatus.accepted && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h1>{call.name} is calling:</h1>
          <button color="primary" className="w-full px-4 py-3" type="button" onClick={answerCall}>
            Answer
          </button>
        </div>
      )}
    </>
  )
})
