/*
 * @Author: zhangboya3 zhangboya3@xiaomi.com
 * @Date: 2025-03-12 10:25:55
 * @LastEditors: zhangboya3 zhangboya3@xiaomi.com
 * @LastEditTime: 2025-03-17 22:18:14
 * @FilePath: /yd-new/app/components/ability-explore/owned-list/card/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'
import { useContext } from 'use-context-selector'
import type { Collection } from '@/models/ability-explore'
import cn from '@/utils/classnames'
import AppIcon from '@/app/components/base/app-icon'
import I18n from '@/context/i18n'
import { getLanguage } from '@/i18n/language'
import { useStore as useLabelStore } from '@/app/components/tools/labels/store'
import IsNew from '../../is-new'

type Props = {
  active: boolean
  collection: Collection
  onSelect: () => void
}

const Card = ({
  active,
  collection,
  onSelect,
}: Props) => {
  const { locale } = useContext(I18n)
  const language = getLanguage(locale)


  return (
    <div className={cn('group col-span-1 bg-white border-2 border-solid border-transparent rounded-xl shadow-sm min-h-[160px] flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg relative', active && '!border-primary-400')} onClick={onSelect}>
      <div className='flex pt-[14px] px-[14px] pb-3 h-[66px] items-center gap-3 grow-0 shrink-0'>
        <div className='relative shrink-0'>
          {typeof collection.icon === 'string' && (
            <div className='w-10 h-10 bg-center bg-cover bg-no-repeat rounded-md' style={{ backgroundImage: `url(${collection.icon})` }} />
          )}
          {typeof collection.icon !== 'string' && (
            <AppIcon
              size='large'
              icon={collection.icon.content}
              background={collection.icon.background}
            />
          )}
        </div>
        <div className='grow w-0 py-[1px]'>
          <div className='flex items-center text-sm leading-5 font-semibold text-gray-800'>
            <div className='truncate' title={collection.name}>{collection.name}</div>
          </div>
        </div>
      </div>
      { 
        collection.is_new &&  <IsNew className="absolute top-[-2px] right-4" />
      }
    
      <div
        className={cn(
          'grow mb-2 px-[14px] max-h-[72px] text-xs leading-normal text-gray-500',
          collection.labels?.length ? 'line-clamp-2' : 'line-clamp-4',
          collection.labels?.length > 0 && 'group-hover:line-clamp-2 group-hover:max-h-[36px]',
        )}
        title={collection.description}
      >
        {collection.description}
      </div>
    </div>
  )
}
export default Card
