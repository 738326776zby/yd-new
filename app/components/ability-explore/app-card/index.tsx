import cn from '@/utils/classnames'
import type { AppBasicInfo } from '@/models/explore'
import AppIcon from '@/app/components/base/app-icon'
export type AppCardProps = {
  collection: AppBasicInfo
  onSelect?: () => void
  active?: boolean
}
const AppCard = ({ onSelect, collection,active }: AppCardProps) => {
  console.log(collection)
  return (
    <div
      className={cn(
        'relative overflow-hidden pb-2 group col-span-1 bg-white border-2 border-solid border-transparent rounded-lg shadow-sm flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg',
        active && '!border-primary-400'
      )}
      onClick={onSelect}
    >
        <div className='flex pt-[14px] px-[14px] pb-3 h-[66px] items-center gap-3 grow-0 shrink-0'>
        <div className='relative shrink-0'>
          {typeof collection.icon === 'string' && (
            <div className='w-10 h-10 bg-center bg-cover bg-no-repeat rounded-md' style={{ backgroundImage: `url(${collection.icon})` }} />
          )}
          {typeof collection.icon !== 'string' && (
            <AppIcon
              size='large'
              icon={collection.icon_url}
              background={collection.icon_background}
            />
          )}
        </div>
        <div className='grow w-0 py-[1px]'>
          <div className='flex items-center text-sm leading-5 font-semibold text-gray-800'>
            <div className='truncate' title={collection.name}>{collection.name}</div>
          </div>
          <div className='flex items-center text-[10px] leading-[18px] text-gray-500 font-medium'>
            <div className='truncate'>类型&nbsp;{collection.mode}</div>
          </div>
        </div>
      </div>
     
      <div className="description-wrapper h-[90px] px-[14px] text-xs leading-normal text-text-tertiary ">
        <div className="line-clamp-4 group-hover:line-clamp-2">
          {collection.description}
        </div>
      </div>
    </div>
  )
}

export default AppCard