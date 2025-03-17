/*
 * @Author: zhangboya3 zhangboya3@xiaomi.com
 * @Date: 2025-03-18 00:45:18
 * @LastEditors: zhangboya3 zhangboya3@xiaomi.com
 * @LastEditTime: 2025-03-18 01:08:43
 * @FilePath: /yd-new/app/components/evaluation/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import EvaluationContext from '@/context/evaluation-context'
import { fetchUserInfo } from '@/service/evaluation'
import { UserInfo } from '@/models/evaluation'

export type IEvaluationProps = {
  children: React.ReactNode
}

const Evaluation: FC<IEvaluationProps> = ({
  children,
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined)

  useEffect(() => {
      document.title = `效果评测 -  Dify`;
      getUserInfo()
   
  }, [])
  const getUserInfo = async () => {
    const res = await fetchUserInfo()
    setUserInfo(res)
  }
  return (
    <div className='flex h-full bg-gray-100 border-t border-gray-200 overflow-hidden'>
      <EvaluationContext.Provider
        value={
          {
            userInfo,
            setUserInfo,
          }
        }
      >
        <div className='grow w-0'>
          {children}
        </div>
      </EvaluationContext.Provider>
    </div>
  )
}
export default React.memo(Evaluation)
