
'use client'
import { useMemo } from 'react'
import { useContext } from 'use-context-selector'
import { useTranslation } from 'react-i18next'
import type { ThirdPartyDataListReqItem } from '@/models/ability-explore'
import cn from '@/utils/classnames'
import AppIcon from '@/app/components/base/app-icon'
import { Tag01 } from '@/app/components/base/icons/src/vender/line/financeAndECommerce'
import I18n from '@/context/i18n'
import { getLanguage } from '@/i18n/language'
import { useStore as useLabelStore } from '@/app/components/tools/labels/store'
import IsNew from '@/app/components/ability-explore/is-new'
type Props = {
  active: boolean
  collection: ThirdPartyDataListReqItem
  onSelect: () => void
  className?: string
}

const ProviderCard = ({
  active,
  collection,
  onSelect,
  className
}: Props) => {
  const { t } = useTranslation()
  return (
    <div className={cn('group col-span-1 bg-white relative border-2 border-solid border-transparent rounded-xl shadow-sm min-h-[160px] flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg', active && '!border-primary-400',className && className)} onClick={onSelect} key={collection.id}>
      { 
        collection.is_new && <IsNew className="absolute top-[-2px] right-4" />
      }
      
      <div className='flex pt-[14px] px-[14px] pb-3 h-[66px] items-center gap-3 grow-0 shrink-0'>
        <div className='relative shrink-0'>
          {typeof collection.icon === 'string' && (
            <div className='w-10 h-10 bg-center bg-cover bg-no-repeat rounded-md' style={{ backgroundImage: `url(${collection.icon})` }} />
          )}
        </div>
        <div className='grow w-0 py-[1px]'>
          <div className='flex items-center text-sm leading-5 font-semibold text-gray-800'>
            <div className='truncate' title={collection.name}>{collection.name}</div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          'grow mb-2 px-[14px] max-h-[72px] text-xs leading-normal text-gray-500  line-clamp-4',
        )}
        title={collection.description}
      >
        {collection.description}
      </div>
      {/* @ts-ignore */}
      { collection?.background_image &&  <div className='absolute bottom-0 right-0 w-[104px] h-[104px]' style={{ backgroundImage: `url(${collection.background_image})` }} />}
    
    
    </div>
  )
}
export default ProviderCard
