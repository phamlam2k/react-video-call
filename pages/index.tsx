import { Suspense } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Notification } from '@components/Notification'
import { Options } from '@components/Options'

const VideoChatScreen = dynamic(() => import('@components/VideoChatScreen').then((mod) => mod.VideoChatScreen), {
  ssr: false,
})

const LoadingSkeleton = dynamic(() => import('@components/LoadingSkeleton').then((mod) => mod.LoadingSkeleton))

export default function Home() {
  return (
    <>
      <Head>
        <title>Video Chat</title>
        <meta name="description" content="Video Chat" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="text-center text-2xl font-bold">Video Chat App</div>
        <div className="mt-6">
          <Suspense fallback={<LoadingSkeleton />}>
            <VideoChatScreen />
          </Suspense>
          <Options>
            <Notification />
          </Options>
        </div>
      </main>
    </>
  )
}
