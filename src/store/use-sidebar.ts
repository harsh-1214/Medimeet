import { create } from 'zustand'

interface SidebarStore {
	collapsed: boolean
	onExpand: () => void
	onCollapse: () => void
	menuCollapse : boolean,
	onToggleExpand : () => void
	onToggleCollapse : () => void
}

export const useSidebar = create<SidebarStore>(set => ({
	collapsed: false,
	menuCollapse : true,
	onExpand() {
		set(() => ({ collapsed: false }))
	},
	onCollapse() {
		set(() => ({ collapsed: true }))
	},
	onToggleExpand(){
		set(() => ({ menuCollapse: false }))
	},
	onToggleCollapse(){
		set(() => ({ menuCollapse: true }))
	},
}))

