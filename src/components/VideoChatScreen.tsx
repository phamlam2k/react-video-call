import React, { useContext } from 'react'
import { SocketContext } from '@utils/SocketContext'

export const VideoChatScreen = React.memo(() => {
  const { name, callStatus, myVideoRef, userVideoRef, stream, call } = useContext(SocketContext)

  return (
    <div className="container grid justify-center gap-x-3 max-xs:gap-y-3 mx-auto">
      {stream ? (
        <div className="p-3 border-[2px] border-[#ebebeb]">
          <div className="grid-cols-6 max-md:grid-cols-12">
            <h1 className="text-xl">{name || 'Name'}</h1>
            <video playsInline muted ref={myVideoRef} autoPlay className="w-[550px] max-xs:w-[300px]" />
          </div>
        </div>
      ) : null}
      {callStatus.accepted && !callStatus.ended && (
        <div className="p-3 border-[2px] border-[#ebebeb]">
          <div className="grid-cols-6 max-md:grid-cols-12">
            <h1 className="text-xl">{call.name || 'Name'}</h1>
            <video playsInline ref={userVideoRef} autoPlay className="w-[550px] max-xs:w-[300px]" />
          </div>
        </div>
      )}
    </div>
  )
})
