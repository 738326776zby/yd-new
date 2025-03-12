'use client'
import React from 'react'
import type { InstalledApp } from '@/models/explore'
import AppIcon from '@/app/components/base/app-icon'
import { AppTypeIcon } from '@/app/components/app/type-selector'
import { useTranslation } from "react-i18next";
type IntroduceProps = {
  target: InstalledApp
}
const Introduce = ({ target }: IntroduceProps) => {
  const { t } = useTranslation();
  return (
    <div className='flex w-[408px] bg-white shadow-[0px_2px_4px_0px_rgba(217,219,232,0.51)] rounded-lg overflow-y-auto  p-4  h-full'>
      <div className='w-full'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='relative shrink-0'>
            <AppIcon
              size="large"
              iconType={target.app.icon_type}
              icon={target.app.icon}
              background={target.app.icon_background}
              imageUrl={target.app.icon_url}
            />
            <AppTypeIcon type={target.app.mode} wrapperClassName='absolute -bottom-0.5 -right-0.5 w-4 h-4 shadow-sm' className='w-3 h-3' />
          </div>
          <div className='flex flex-col'>
            <div className='text-sm font-medium text-gray-900'>{target?.app?.name}</div>
            <div className='text-xs text-gray-500 flex items-center gap-2'>
              {target.app.mode === "advanced-chat" && (
                <div className="truncate">
                  {t("app.types.advanced").toUpperCase()}
                </div>
              )}
              {target.app.mode === "chat" && (
                <div className="truncate">
                  {t("app.types.chatbot").toUpperCase()}
                </div>
              )}
              {target.app.mode === "agent-chat" && (
                <div className="truncate">
                  {t("app.types.agent").toUpperCase()}
                </div>
              )}
              {target.app.mode === "workflow" && (
                <div className="truncate">
                  {t("app.types.workflow").toUpperCase()}
                </div>
              )}
              {target.app.mode === "completion" && (
                <div className="truncate">
                  {t("app.types.completion").toUpperCase()}
                </div>
              )}
              <span>更新于{target.publish_time}</span>
            </div>
          </div>
        </div>
        <div className='text-sm text-gray-700'>
          {
            target.app.description
          }
        </div>
      </div>
    </div>
  )
}
export default Introduce
