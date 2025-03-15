'use client'
import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'antd';
import { QuestionCircleFilled, DownloadOutlined, RedoOutlined } from '@ant-design/icons';
import EvaluationPrincipleModal from '@/app/components/evaluation/evaluation-principle';
import {
  useSearchParams,
} from 'next/navigation'
import { Checkbox, Table } from 'antd';
import AppIcon from '@/app/components/base/app-icon'
import Input from '@/app/components/base/input'
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined } from '@ant-design/icons'
import { BaseResponse, EvaluationRecord, RecordTableListItem, PageinfoProps, GetRecordlistReq } from '@/models/evaluation'
import test from '../list/test.json'
import { getRecordlist,downloadReviews,downloadCollections } from '@/service/evaluation'
import testTableData from './test.json'
import NewReviewsModal from '@/app/components/evaluation/new-reviews-modal'
const AppList = () => {
  const searchParams = useSearchParams()
  const tenant_id = searchParams.get('tenant_id') || ''
  const collections_id = searchParams.get('collections_id') || ''
  const columns = [
    {
      title: '序号',
      dataIndex: 'name',
      key: 'name',
      //@ts-ignore
      render: (a, b, i) => {
        return i+1
      }
    },
    {
      title: '评测对象',
      dataIndex: 'evaluation_object',
      key: 'evaluation_object',
    },
    {
      title: '本次评测说明',
      dataIndex: 'task_description',
      key: 'task_description',
    },
    {
      title: '评测人',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: '评测时间',
      dataIndex: 'evaluation_time',
      key: 'evaluation_time',
    },
    {
      title: '评测结果',
      dataIndex: 'results',
      key: 'results',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
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
      //@ts-ignore
      render: (index, row) => {
        return <>
          <Button type="link" icon={<span className={`icon iconfont icon-download-2-line`} onClick={() => { 
            downloadReviews(row.id,row.workspace_id)
          }}></span>}>查看评测报告</Button>
          <Button type="link" icon={<span className={`icon iconfont icon-shuaxin`}></span>}>重新评测</Button>
        </>
      }
    },
  ];
  const [details, setDetaills] = useState<EvaluationRecord | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [tableData, setTableData] = useState<EvaluationRecord[]>([])
  const [tableParams, setTableParams] = useState<GetRecordlistReq>({
    tenant_id,
    collections_id,
    user_id: '',
    pageNum: 1,
    pageSize: 10,
    evaluation_object: ""
  })
 
  const getDetailsList = async () => {
    // const res = await getCollectionsSchemelist()
    const res = test as BaseResponse<{ list: EvaluationRecord[] }>
    if (res.code === 200) {
      const _detail = res.data?.list.filter(item => item.id === collections_id)
      setDetaills(_detail?.[0] || undefined)
    }
  }
  const getTableList = async (params: GetRecordlistReq) => {
    // const res = await getRecordlist({
    //   ...tableParams,
    //   ...params
    // })
    // @ts-ignore
    const res = testTableData as BaseResponse<PageinfoProps<EvaluationRecord[]>>
    if (res.code === 200) {
      //@ts-ignore
      setTableData(res.data.list)
      const { pages } = res.data 
      setTableParams({
        ...tableParams,
        pages,
        ...params,
      })
    }
  }
  useEffect(() => {
    getDetailsList()
    getTableList({})
  }, [])
  const downloadCollection = async (e:React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (details) { 
      downloadCollections(details?.id,details?.tenant_id)
    }
  };
  
  return (
    <div className='relative flex justify-center overflow-y-auto bg-background-body shrink-0 h-0 grow  gap-4 p-6'>
      <div className='w-[336px] bg-white flex flex-col shadow-[0px_8px_16px_0px_rgba(217,219,232,0.51)] rounded-lg border border-[#E1E3E7]'>
        <div className='flex  pt-[14px] px-[14px] pb-4 border-b border-dashed border-[#E1E3E7] '>
          <div className='relative w-10 h-10'>

          </div>
          <div className='grow  py-[1px] flex-1'>
            <div className='flex items-center text-sm leading-5 font-semibold text-gray-800 justify-between'>
              <div className='truncate' title={details?.name}>{details?.name}</div>
              <Button type="link" icon={<DownloadOutlined />} className='text-[12px]' onClick={downloadCollection}>下载</Button>
            </div>
            <div className='flex items-center text-[10px] leading-[18px] text-gray-500 font-medium'>
              <div className='truncate'>发布于&nbsp;{details?.created_time}</div>
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
              {details?.source}
            </div>
          </div>
          <div className='flex flex-col flex-1 gap-1 text-[#667085] text-[14px]'>
            <div className='flex gap-1 items-center'>
              <span className='inline-block w-[6px] h-[6px] bg-[#155EEF] rounded-full'></span>
              适用说明
            </div>
            <div>
            {details?.instructions}
            </div>
          </div>
          <div className='flex flex-col flex-1 gap-1 text-[#667085] text-[14px]'>
            <div className='flex gap-1 items-center'>
              <span className='inline-block w-[6px] h-[6px] bg-[#155EEF] rounded-full'></span>
              评测方式简介
            </div>
            <div>
            {details?.introduction}
            </div>
          </div>
          <div className='flex flex-col flex-1 gap-1 text-[#667085] text-[14px]'>
            <div className='flex gap-1 items-center'>
              <span className='inline-block w-[6px] h-[6px] bg-[#155EEF] rounded-full'></span>
              评测方法
            </div>
            <div>
              {details?.evaluation_type}
            </div>
          </div>
        </div>
      </div>
      <div className='flex-1 bg-white flex flex-col border-r-3  shadow-[0px_8px_16px_0px_rgba(217,219,232,0.51)] rounded-lg border border-[#E1E3E7]'>
        <div className='flex items-center justify-between p-4'>
          <div>
            <Checkbox value={!!tableParams.user_id} onChange={(e) => {
              console.log(e.target.checked)
              console.log(window.localStorage.getItem('userId'))
              getTableList({
                user_id: e.target.checked ? window.localStorage.getItem('userId')||'' : ''
              })
            }}>只看我的评测记录</Checkbox>
          </div>
          <div className='flex gap-4'>
            <Input
              showLeftIcon
              showClearIcon
              wrapperClassName="w-[200px]"
              value={tableParams.evaluation_object}
              onChange={(e) => {
                getTableList({
                  evaluation_object: e.target.value
                })
              }}
              onClear={() => {
                getTableList({
                  evaluation_object: ''
                })
              }}
            />
            <Button shape='round' type='primary' onClick={() => { 
              setOpen(true)
            }}>新建评测</Button>
          </div>
        </div>
        <Table dataSource={tableData} columns={columns} size="small" />
        <NewReviewsModal details={details} onCancel={() => {
          setOpen(false)
          getTableList({})
        }}  open={open} />
      </div>
    </div >
  )
}

export default AppList
