/* eslint-disable @typescript-eslint/no-empty-function */
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import Peer from 'simple-peer'
import { SOCKET_KEYS } from '@src/models/socket'
import { useRouter } from 'next/router'

const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL as string)

interface ISocketContext {
  call: ICall
  callStatus: ICallStatus
  myVideoRef: React.RefObject<HTMLVideoElement>
  userVideoRef: React.RefObject<HTMLVideoElement>
  stream: MediaStream | undefined
  name: string
  setName: Dispatch<SetStateAction<string>>
  me: string
  callUser: (id: string) => void
  leaveCall: () => void
  answerCall: () => void
}

const SocketContext = React.createContext<ISocketContext>({
  call: {
    from: '',
    name: '',
    signal: '',
    isReceivedCall: false,
  },
  callStatus: {
    accepted: false,
    ended: false,
  },
  myVideoRef: React.createRef<HTMLVideoElement>(),
  userVideoRef: React.createRef<HTMLVideoElement>(),
  stream: undefined,
  name: '',
  setName: function () {},
  me: '',
  callUser: function (_id) {},
  leaveCall: function () {},
  answerCall: function () {},
})

interface Props {
  children: React.ReactNode
}
interface ICallUser {
  from: string
  name: string
  signal: Peer.SignalData | string
}
interface ICall extends ICallUser {
  isReceivedCall: boolean
}
interface ICallStatus {
  accepted: boolean
  ended: boolean
}

const SocketContextProvider: React.FC<Props> = ({ children }) => {
  const router = useRouter()
  const [stream, setStream] = useState<MediaStream>()
  const [me, setMe] = useState<string>('')
  const [name, setName] = useState('')
  const [call, setCall] = useState<ICall>({
    from: '',
    name: '',
    signal: '',
    isReceivedCall: false,
  })
  const [callStatus, setCallStatus] = useState<ICallStatus>({
    accepted: false,
    ended: false,
  })

  const myVideoRef = useRef<HTMLVideoElement>(null)
  const userVideoRef = useRef<HTMLVideoElement>(null)
  const connectionRef = useRef<any>(null)

  useEffect(() => {
    void navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream)
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = currentStream
      }
    })

    if (socket.connected) {
      setMe(socket.id)
    }
    socket.on(SOCKET_KEYS.CALL_USER, ({ from, name: callerName, signal }: ICallUser) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal })
    })

    // return () => {
    //   socket.off(SOCKET_KEYS.ME)
    //   socket.off(SOCKET_KEYS.CALL_USER)
    // }
  }, [])

  const answerCall = () => {
    setCallStatus((prev) => ({ ...prev, accepted: true }))

    const peer = new Peer({ initiator: false, trickle: false, stream })

    peer.on('signal', (data) => {
      socket.emit(SOCKET_KEYS.ANSWER_CALL, { signal: data, to: call.from })
    })

    peer.on('stream', (currentStream) => {
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = currentStream
      }
    })

    peer.signal(call.signal)

    connectionRef.current = peer
  }

  const callUser = (id: string) => {
    const peer = new Peer({ initiator: true, trickle: false, stream })

    peer.on('signal', (data) => {
      socket.emit(SOCKET_KEYS.CALL_USER, { userToCall: id, signalData: data, from: me, name })
    })

    peer.on('stream', (currentStream) => {
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = currentStream
      }
    })

    socket.on(SOCKET_KEYS.ACCEPTED_CALL, ({ signal }: Record<'signal', Peer.SignalData>) => {
      setCallStatus((prev) => ({ ...prev, accepted: true }))

      peer.signal(signal)
    })

    connectionRef.current = peer
  }

  const leaveCall = () => {
    setCallStatus((prev) => ({ ...prev, ended: true }))

    connectionRef.current.destroy()

    router.reload()
  }

  return (
    <SocketContext.Provider
      value={{ call, callStatus, myVideoRef, userVideoRef, stream, name, setName, me, callUser, leaveCall, answerCall }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export { SocketContext, SocketContextProvider }
