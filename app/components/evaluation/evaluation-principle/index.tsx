'use client'
import React, { useState } from 'react'
import s from './style.module.css'
import { Modal, Button } from 'antd'
import cn from '@/utils/classnames'
type EvaluationPrincipleProps = {
  open?: boolean
  setOpen: () => void
}
const EvaluationPrincipleModal = ({ open, setOpen }: EvaluationPrincipleProps) => {

  return (
    <Modal
      title="查看效果评测原理"
      onCancel={() => {
        setOpen()
      }}
      width={610}
      footer={
        <Button type="primary" onClick={() => {
          setOpen()
        }}>
          确认
        </Button>
      }
      open={open}
    >
      <p className={cn('w-[570px] h-[280px]', s.evaluationFlow)}></p>

    </Modal>
  )
}

export default EvaluationPrincipleModal
