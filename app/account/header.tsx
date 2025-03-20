/*
 * @Author: zhangboya3 zhangboya3@xiaomi.com
 * @Date: 2024-12-30 10:43:41
 * @LastEditors: zhangboya3 zhangboya3@xiaomi.com
 * @LastEditTime: 2025-03-20 15:11:42
 * @FilePath: /yd-new/app/account/header.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'
import { useTranslation } from 'react-i18next'
import { RiArrowRightUpLine, RiRobot2Line } from '@remixicon/react'
import { useRouter } from 'next/navigation'
import Button from '../components/base/button'
import Avatar from './avatar'
import LogoSite from '@/app/components/base/logo/logo-site'

const Header = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const back = () => {
    router.back()
  }
  return (
    <div className='flex flex-1 items-center justify-between px-4'>
      <div className='flex items-center gap-3'>
        <div className='flex items-center cursor-pointer' onClick={back}>
          <LogoSite className='object-contain' />
        </div>
        <div className='w-[1px] h-4 bg-divider-regular' />
        <p className='text-text-primary title-3xl-semi-bold'>{t('common.account.account')}</p>
      </div>
      <div className='flex items-center flex-shrink-0 gap-3'>
        <Button className='gap-2 py-2 px-3 system-sm-medium' onClick={back}>
          <RiRobot2Line className='w-4 h-4' />
          <p>{t('common.account.studio')}</p>
          <RiArrowRightUpLine className='w-4 h-4' />
        </Button>
        <div className='w-[1px] h-4 bg-divider-regular' />
        <Avatar />
      </div>
    </div>
  )
}
export default Header
