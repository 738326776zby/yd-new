'use client'
import  { FC,useState,useEffect } from 'react'
import React from 'react'
import TextGenerationApp from '@/app/components/share/text-generation'
import Loading from '@/app/components/base/loading'
import ChatWithHistory from '@/app/components/base/chat/chat-with-history'
import { fetchInstalledAppList } from '@/service/explore'
import type { InstalledApp } from '@/models/explore'
import { useSearchParams } from 'next/navigation'
import Introduce from '@/app/components/ability-explore/introduce'
export type ItargetDataProps = {
  id: string
}

const InstalledApp: FC<ItargetDataProps> = ({
  id
}) => {
  const [targetData, setTargetData] = useState<InstalledApp | undefined>(undefined)
  const searchParams = useSearchParams()
  const isRecommended = searchParams.get('type') === 'recommended'
  useEffect(()=>{
    const fetchData = async () => {
      //@ts-ignored
      let { installed_apps } = await fetchInstalledAppList()
      //
      const target = installed_apps.filter(item => item?.id == id)
      setTargetData(target.length? target[0] : undefined)
    }
    fetchData()
  },[])

  if (!targetData) {
    return (
      <div className='flex h-full items-center'>
        <Loading type='area' />
      </div>
    )
  }
  return (
    <div className='h-full py-2 pl-0 pr-2 sm:p-2 mt-4 flex gap-4' >
      {targetData.app.mode !== 'completion' && targetData.app.mode !== 'workflow' && (
         <ChatWithHistory installedAppInfo={targetData} className='rounded-2xl shadow-md overflow-hidden flex-1' />
      )}
      {targetData.app.mode === 'completion' && (
          <TextGenerationApp isInstalledApp installedAppInfo={targetData}/>
      )}
      {targetData.app.mode === 'workflow' && (
        <TextGenerationApp isWorkflow isInstalledApp installedAppInfo={targetData}/>
      )}
      { 
        isRecommended && <Introduce target={targetData} />
      }
    </div>
  )
}
export default React.memo(InstalledApp)
