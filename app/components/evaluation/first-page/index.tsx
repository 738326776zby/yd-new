/*
 * @Author: zhangboya3 zhangboya3@xiaomi.com
 * @Date: 2025-03-18 01:14:42
 * @LastEditors: zhangboya3 zhangboya3@xiaomi.com
 * @LastEditTime: 2025-03-18 01:19:31
 * @FilePath: /yd-new/app/components/evaluation/first-page/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react'
import { Button } from 'antd';
import { QuestionCircleFilled } from '@ant-design/icons';
import EvaluationPrincipleModal from '@/app/components/evaluation/evaluation-principle';
import { useRouter } from 'next/navigation'
import s from './app.module.css'
import cn from '@/utils/classnames'
const AppList = () => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter()
  return (
    <div className='relative flex justify-center overflow-y-auto bg-background-body shrink-0  grow items-center'>
      <div className='width-[960px] flex flex-col '>
        <div className='flex  justify-center'>
          <div className='font-bold text-2xl text-[#1D2939] leading-[33px] '>欢迎使用效果评测</div>
          <Button type="link" icon={<QuestionCircleFilled />} onClick={() => {
            setOpen(true)
          }}>查看效果评测原理</Button>
        </div>
        <div className='font-normal text-sm text-[#495464] leading-[22px] text-justify mt-2 mb-20'>本功能可基于具体应用场景评测集，评价您所研发的对应工作流/智能体的实际运行效果，从而帮助你更好改进和优化应用，实现对效果的持续跟踪和比较。</div>
        <div className='flex'>
          <div className='flex flex-col flex-1 items-center'>
            <div className={cn("w-[240px] h-[160px] bg-white", s.step0)}></div>
            <span className='font-bold text-lg text-[#495464] mt-4 mb-1'>第一步：选择评测方案</span>
            <span className='font-normal text-sm text-[#495464] w-60  text-center'>评测方案基于具体场景应用设计，可在不同评测任务中反复使用。</span>
          </div>
          <div className='flex flex-col flex-1 items-center'>
            <div className={cn("w-[240px] h-[160px] bg-white", s.step1)}></div>
            <span className='font-bold text-lg text-[#495464] mt-4 mb-1'>第二步：选择评测对象</span>
            <span className='font-normal text-sm text-[#495464] w-60  text-center'>选择与评测集所对应的某个工作流或者智能体。</span>
          </div>
          <div className='flex flex-col flex-1 items-center'>
          <div className={cn("w-[240px] h-[160px] bg-white", s.step2)}></div>
            <span className='font-bold text-lg text-[#495464] mt-4 mb-1'>第三步：查看评测结果</span>
            <span className='font-normal text-sm text-[#495464] w-60 text-center'>查看评测结果，并可下载详细评测报告。</span>
          </div>
        </div>
        <div className='flex mt-10 justify-center'>
          <Button type='primary' shape="round" className='w-[120px]' onClick={() => {
            router.push('/evaluation/list')
          }}>
            进入评测
          </Button>
        </div>
      </div>
      <EvaluationPrincipleModal open={open} setOpen={() => {
        setOpen(!open)
      }} />

    </div >
  )
}

export default AppList
