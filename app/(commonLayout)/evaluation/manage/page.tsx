'use client'
import React, { useState } from 'react'
import { Button, Modal } from 'antd';
import { QuestionCircleFilled, DownloadOutlined,RedoOutlined } from '@ant-design/icons';
import EvaluationPrincipleModal from '@/app/components/evaluation/evaluation-principle';
import { useRouter } from 'next/navigation'
import type { EvaluationItem } from '@/models/evaluation'
import { Checkbox, Table } from 'antd';
import AppIcon from '@/app/components/base/app-icon'
import Input from '@/app/components/base/input'
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined } from '@ant-design/icons'

const AppList = () => {
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
      type: 1
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
      type: 2
    },
    {
      key: '3',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
      type: 3
    },
  ];

  const columns = [
    {
      title: '序号',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '评测对象',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '本次评测说明',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '评测人',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '评测时间',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '评测结果',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '状态',
      dataIndex: 'age',
      key: 'age',
      //@ts-ignore
      render: (index, row) => {
        if (row.type === 1) {
          return <span className='text-[#50B593]'><CheckCircleFilled className='mr-2' />评测成功</span>
        } else if (row.type == 2) {
          return <span className='text-[#FB6E6C]'><CheckCircleFilled className='mr-2' />评测失败</span>
        } else {
          return <span className='text-[#389BFF]'> <span className={`icon iconfont icon-jiazai mr-2`}></span>评测中</span>
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'address',
      key: 'address',
      render: (index, row) => {
        return <>
          <Button type="link" icon={<span className={`icon iconfont icon-download-2-line`}></span>}>查看评测报告</Button>
          <Button type="link" icon={ <span className={`icon iconfont icon-shuaxin`}></span>}>重新评测</Button>
        </>
      }
    },
  ];

  const [lookMe, setLookMe] = useState<boolean>(false)
  const [keywords, setKeywords] = useState('')
  const [chooseTarget, setChooseTarget] = useState<EvaluationItem | undefined>(
    {
      title: '评测集名称',
      icon: '',
      publishTime: '2024-10-1'
    }
  )
  return (
    <div className='relative flex justify-center overflow-y-auto bg-background-body shrink-0 h-0 grow  gap-4 p-6'>
      <div className='w-[336px] bg-white flex flex-col shadow-[0px_8px_16px_0px_rgba(217,219,232,0.51)] rounded-lg border border-[#E1E3E7]'>
        <div className='flex  pt-[14px] px-[14px] pb-4 border-b border-dashed border-[#E1E3E7] '>
          <div className='relative w-10 h-10'>
            {typeof chooseTarget?.icon === 'string' && (
              <div className='w-10 h-10 bg-center bg-cover bg-no-repeat rounded-md' style={{ backgroundImage: `url(${chooseTarget?.icon})` }} />
            )}
            {typeof chooseTarget?.icon !== 'string' && chooseTarget?.icon && (
              <AppIcon
                size='large'
                icon={chooseTarget.icon?.content}
                background={chooseTarget?.icon.background}
              />
            )}
          </div>
          <div className='grow  py-[1px] flex-1'>
            <div className='flex items-center text-sm leading-5 font-semibold text-gray-800 justify-between'>
              <div className='truncate' title={chooseTarget?.title}>{chooseTarget?.title}</div>
              <Button type="link" icon={<DownloadOutlined />} className='text-[12px]'>下载</Button>
            </div>
            <div className='flex items-center text-[10px] leading-[18px] text-gray-500 font-medium'>
              <div className='truncate'>发布于&nbsp;{chooseTarget?.publishTime}</div>
            </div>
          </div>
        </div>
        <div className='flex flex-col p-4 gap-4'>
          <div className='flex flex-col flex-1 gap-1 text-[#667085] text-[14px]'>
            <div className='flex gap-1 items-center'>
              <span className='inline-block w-[6px] h-[6px] bg-[#155EEF] rounded-full'></span>
              来源
            </div>
            <div>
              内容内容内容内容内容内容内容内容内容内容
            </div>
          </div>
          <div className='flex flex-col flex-1 gap-1 text-[#667085] text-[14px]'>
            <div className='flex gap-1 items-center'>
              <span className='inline-block w-[6px] h-[6px] bg-[#155EEF] rounded-full'></span>
              适用说明
            </div>
            <div>
              内容内容内容内容内容内容内容内容内容内容
            </div>
          </div>
          <div className='flex flex-col flex-1 gap-1 text-[#667085] text-[14px]'>
            <div className='flex gap-1 items-center'>
              <span className='inline-block w-[6px] h-[6px] bg-[#155EEF] rounded-full'></span>
              评测方式简介
            </div>
            <div>
              内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
            </div>
          </div>
          <div className='flex flex-col flex-1 gap-1 text-[#667085] text-[14px]'>
            <div className='flex gap-1 items-center'>
              <span className='inline-block w-[6px] h-[6px] bg-[#155EEF] rounded-full'></span>
              评测方法
            </div>
            <div>
              内容内容内容内容内容内容内容内容内容内容
            </div>
          </div>
        </div>
      </div>
      <div className='flex-1 bg-white flex flex-col border-r-3  shadow-[0px_8px_16px_0px_rgba(217,219,232,0.51)] rounded-lg border border-[#E1E3E7]'>
        <div className='flex items-center justify-between p-4'>
          <div>
            <Checkbox value={lookMe} onChange={(e) => {
              setLookMe(e.target.checked)
            }}>只看我的评测记录</Checkbox>
          </div>
          <div className='flex gap-4'>
            <Input
              showLeftIcon
              showClearIcon
              wrapperClassName="w-[200px]"
              value={keywords}
              onChange={(e) => {
                setKeywords(e.target.value)
              }}
              onClear={() => {
                setKeywords('')
              }}
            />
            <Button shape='round' type='primary'>新建评测</Button>
          </div>
        </div>
        <Table dataSource={dataSource} columns={columns} size="small" />
      </div>
    </div >
  )
}

export default AppList
