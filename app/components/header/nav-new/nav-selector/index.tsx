/*
 * @Author: zhangboya3 zhangboya3@xiaomi.com
 * @Date: 2025-03-19 10:55:45
 * @LastEditors: zhangboya3 zhangboya3@xiaomi.com
 * @LastEditTime: 2025-03-19 15:48:23
 * @FilePath: /yd-new/app/components/header/nav-new/nav-selector/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'
import { useTranslation } from 'react-i18next'
import { Fragment, useCallback } from 'react'
import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
} from '@remixicon/react'
import { Menu, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { debounce } from 'lodash-es'
import cn from '@/utils/classnames'
import AppIcon from '@/app/components/base/app-icon'
import { AiText, ChatBot, CuteRobot } from '@/app/components/base/icons/src/vender/solid/communication'
import { FileArrow01, FilePlus01, FilePlus02 } from '@/app/components/base/icons/src/vender/line/files'
import type { AppIconType } from '@/types/app'
import { useSearchParams } from 'next/navigation'
import { EvaluationRecord } from '@/models/evaluation'

export type NavItem = {
  id: string
  name: string
  link: string
  icon_type: AppIconType | null
  icon: string
  icon_background: string
  icon_url: string | null
  mode?: string
}
export type INavSelectorProps = {
  navs: EvaluationRecord[]
  curNav: EvaluationRecord | null
  setCurNav: (nav: EvaluationRecord) => void
}

const NavSelector = ({  navs,curNav,setCurNav }: INavSelectorProps) => {
  const router = useRouter()
 
  return (
    <div className="">
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <Menu.Button className={cn(
              'group inline-flex items-center w-full h-7 justify-center rounded-[10px] pl-2 pr-2.5 text-[14px] font-semibold text-components-main-nav-nav-button-text-active hover:hover:bg-components-main-nav-nav-button-bg-active-hover',
              open && 'bg-components-main-nav-nav-button-bg-active',
            )}>
              <div className='max-w-[180px] truncate' title={curNav?.name}>{curNav?.name}</div>
              <RiArrowDownSLine
                className={cn('shrink-0 w-3 h-3 ml-1 opacity-50 group-hover:opacity-100', open && '!opacity-100')}
                aria-hidden="true"
              />
            </Menu.Button>
            <Menu.Items
              className="
                absolute -left-11 right-0 mt-1.5 w-60 max-w-80
                divide-y divide-gray-100 origin-top-right rounded-lg bg-white
                shadow-lg
              "
            >
              <div className="px-1 py-1 overflow-auto" style={{ maxHeight: '50vh' }} >
                {
                  navs.map(nav => (
                    <Menu.Item key={nav.id}>
                      <div className='flex items-center w-full px-3 py-[6px] text-gray-700 text-[14px] rounded-lg font-normal hover:bg-gray-100 cursor-pointer truncate' onClick={() => {
                        setCurNav(nav)
                        router.push(`/evaluation/manage/${nav.id}`)
                      }} title={nav.name}>
                        <div className='truncate'>
                          {nav.name}
                        </div>
                      </div>
                    </Menu.Item>
                  ))
                }
              </div>
            </Menu.Items>
          </>
        )}
      </Menu>
    </div>
  )
}

export default NavSelector
