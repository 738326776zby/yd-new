/*
 * @Author: zhangboya3 zhangboya3@xiaomi.com
 * @Date: 2025-03-18 00:43:46
 * @LastEditors: zhangboya3 zhangboya3@xiaomi.com
 * @LastEditTime: 2025-03-18 01:06:12
 * @FilePath: /yd-new/app/(commonLayout)/evaluation/layout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { FC } from 'react'
import React from 'react'
import EvaluationClient from '@/app/components/evaluation'
export type IAppDetail = {
  children: React.ReactNode
}

const EvaluationLayout: FC<IAppDetail> = ({ children }) => {
  return (
      <EvaluationClient>
      {children}
    </EvaluationClient>
  )
}

export default React.memo(EvaluationLayout)
