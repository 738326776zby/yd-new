'use client'

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useRouter } from 'next/navigation'
import {
  RiBook2Fill,
  RiBook2Line,
} from '@remixicon/react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { flatten } from 'lodash-es'
import Nav from '../nav'
import type { NavItem } from '../nav/nav-selector'
import { fetchDatasetDetail, fetchDatasets } from '@/service/datasets'
import type { DataSetListResponse } from '@/models/datasets'

const getKey = (pageIndex: number, previousPageData: DataSetListResponse) => {
  if (!pageIndex || previousPageData.has_more)
    return { url: 'datasets', params: { page: pageIndex + 1, limit: 30 } }
  return null
}

const DatasetNav = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { datasetId } = useParams()
  const { data: currentDataset } = useSWR(
    datasetId
      ? {
        url: 'fetchDatasetDetail',
        datasetId,
      }
      : null,
    apiParams => fetchDatasetDetail(apiParams.datasetId as string))
  const { data: datasetsData, setSize } = useSWRInfinite(datasetId ? getKey : () => null, fetchDatasets, { revalidateFirstPage: false, revalidateAll: true })
  const datasetItems = flatten(datasetsData?.map(datasetData => datasetData.data))

  const handleLoadmore = useCallback(() => {
    setSize(size => size + 1)
  }, [setSize])

  return (
    <Nav
      icon={<span className='icon iconfont icon-article-line mr-1'></span>}
      activeIcon={<span className='icon iconfont icon-article-fill mr-1'></span>}
      text={"知识库自定义"}
      activeSegment='datasets'
      link='/datasets'
      curNav={currentDataset as Omit<NavItem, 'link'>}
      navs={datasetItems.map(dataset => ({
        id: dataset.id,
        name: dataset.name,
        link: dataset.provider === 'external' ? `/datasets/${dataset.id}/hitTesting` : `/datasets/${dataset.id}/documents`,
        icon: dataset.icon,
        icon_background: dataset.icon_background,
      })) as NavItem[]}
      createText={t('common.menus.newDataset')}
      onCreate={() => router.push('/datasets/create')}
      onLoadmore={handleLoadmore}
    />
  )
}

export default DatasetNav