import cn from '@/utils/classnames'
import type { AppBasicInfo } from '@/models/explore'
import AppIcon from '@/app/components/base/app-icon'
import { useTranslation } from 'react-i18next'
import IsNew from '@/app/components/ability-explore/is-new'
export type AppCardProps = {
  collection: AppBasicInfo
  onSelect?: () => void
  active?: boolean
}
const AppCard = ({ onSelect, collection, active }: AppCardProps) => {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        'relative overflow-hidden pb-2 group col-span-1 bg-white border-2 border-solid border-transparent rounded-lg shadow-sm flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg',
        active && '!border-primary-400'
      )}
      onClick={onSelect}
    >
      {collection.is_new && <IsNew className="absolute top-[-2px] right-4" />}

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
          <div className='flex items-center text-sm leading-5 font-semibold text-text-secondary'>
            <div className='truncate' title={collection.name}>{collection.name}</div>
          </div>
          <div className='flex items-center text-[10px] leading-[18px] text-text-tertiary font-medium'>
            {collection.mode === 'advanced-chat' && <div className='truncate'>{t('app.types.advanced').toUpperCase()}</div>}
            {collection.mode === 'chat' && <div className='truncate'>{t('app.types.chatbot').toUpperCase()}</div>}
            {collection.mode === 'agent-chat' && <div className='truncate'>{t('app.types.agent').toUpperCase()}</div>}
            {collection.mode === 'workflow' && <div className='truncate'>{t('app.types.workflow').toUpperCase()}</div>}
            {collection.mode === 'completion' && <div className='truncate'>{t('app.types.completion').toUpperCase()}</div>}
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