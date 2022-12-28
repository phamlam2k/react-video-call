import React, { useContext, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { SocketContext } from '@utils/SocketContext'

interface Props {
  children: React.ReactNode
}

export const Options: React.FC<Props> = React.memo(({ children }) => {
  const { me, callStatus, name, setName, leaveCall, callUser } = useContext(SocketContext)
  const [idToCall, setIdToCall] = useState<string>('')

  return (
    <div className="w-[660px] my-9 mx-auto p-0 max-xs:w-[80%]">
      <div className="py-3 px-5 border-[2px]">
        <form className="flex flex-col" noValidate autoComplete="off">
          <div className="w-full max-xs:flex-col">
            <div className="grid-cols-6 max-md:grid-cols-12">
              <h5 className="text-sm">Account Info</h5>
              <label htmlFor="name">Name</label>
              <input
                className="w-full pl-3 py-1 text-black"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <CopyToClipboard text={me}>
                <button color="primary" className="w-full px-4 py-3" type="button">
                  Copy Your ID
                </button>
              </CopyToClipboard>
            </div>
            <div className="grid-cols-6 max-md:grid-cols-12">
              <h5 className="text-sm">Account Info</h5>
              <label htmlFor="id">ID to call</label>
              <input
                className="w-full pl-3 py-1 text-black"
                type="text"
                name="id"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
              />
              {callStatus.accepted && !callStatus.ended ? (
                <button
                  color="secondary"
                  className="mt-3 text-black px-4 py-3 bg-[#ebebeb]"
                  type="button"
                  onClick={leaveCall}
                >
                  Hang Up
                </button>
              ) : (
                <button
                  color="primary"
                  className="mt-3 text-black px-4 py-3 bg-[#ebebeb]"
                  type="button"
                  onClick={() => callUser(idToCall)}
                >
                  Call
                </button>
              )}
            </div>
          </div>
        </form>
        {children}
      </div>
    </div>
  )
})
