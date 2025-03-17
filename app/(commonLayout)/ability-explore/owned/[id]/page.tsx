"use client"
import type { FC } from 'react'
import React from 'react'
import Page from '@/app/components/ability-explore/owned-page'

export type IInstalledAppProps = {
  params: {
    appId: string
  }
}

const InstalledApp: FC<IInstalledAppProps> = ({ params: { id } }) => {
  return (
   <Page id={id} />
  )
}
export default React.memo(InstalledApp)
