'use client'

import { cn } from '@/lib/utils'
import { useSidebar } from '@/store/use-sidebar'
import { useMediaQuery } from 'usehooks-ts'

interface WrapperProps {
	children: React.ReactNode,
}

export function Wrapper({ children}: WrapperProps) {
	const { collapsed,menuCollapse,onToggleCollapse,onToggleExpand } = useSidebar(state => state)
	const isMobileScreen = useMediaQuery(`(max-width : 640px)`);
	return (
		<aside
			className={cn(
				'fixed left-0 flex flex-col h-full border-r bg-background z-50 pt-4',
				// 'w-70px',
				collapsed && 'w-[70px]',
				// 'lg:w-[70px]',
				!collapsed && 'w-60',
				// isMobileScreen && ' -left-40',
				
				// !menuCollapse && 'left-0 w-60 transition-all',
				
				// menuCollapse && '-left-40'
			)}
		>
			{children}
		</aside>
	)
}