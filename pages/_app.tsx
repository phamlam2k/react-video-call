import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SocketContextProvider } from '@utils/SocketContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SocketContextProvider>
      <Component {...pageProps} />
    </SocketContextProvider>
  )
}
