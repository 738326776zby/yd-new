import { createContext } from 'use-context-selector'
import type { Collection } from '@/models/ability-explore'
import type {
  NavItem,
  NavSection,
} from '@/models/ability-explore'

type IExplore = {
  setActiveTabItem: (item: NavSection & NavItem) => void
  activeTabItem: NavSection & NavItem
}

const ExploreContext = createContext<IExplore>({
  //记录选中 tab
  setActiveTabItem: () => { },
  activeTabItem: {
    title: '',
    mainTitle: '',
    list: [],
    desc: '',
    key: 'owned',
    icon: '',
  },
})
export default ExploreContext