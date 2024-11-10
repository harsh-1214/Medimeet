'use client'

// import { useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { Fullscreen, KeyRound, MessageSquare, Users } from 'lucide-react'
import { NavItem, NavItemSkeleton } from './nav-item'
import { cn } from '@/lib/utils'
import { useMediaQuery } from 'usehooks-ts'

export function Navigation({role} : {role : string}) {
	const pathname = usePathname()
	// const isMobileScreen = useMediaQuery(`(max-width : 640px)`);

	const isDoctor = role === 'doctor';

	// const { user } = useUser()
	const routes = [
		{
			label: !isDoctor ? 'Upcoming Appointments' : 'Scheduled Appointments',
			href: !isDoctor ?  `/u/dashboard/upcoming_Appointments` : '/u/dashboard/scheduled_appointments',
			icon: Fullscreen
		},
		{
			label: 'Appointment History',
			href: `/u/dashboard/appointment_history`,
			icon: KeyRound
		},
	]
	if(isDoctor){
		routes.push({
			label: 'Edit Profile',
			href: `/u/dashboard/edit_profile`,
			icon: MessageSquare
		})
	}

	if(!role) {
		return (
			<ul className='space-y-2'>
				{[...Array(3)].map((_, i) => (
					<NavItemSkeleton key={i} />
				))}
			</ul>
		)
	}

	return (
		<ul className= { cn(
			'space-y-2 px-2 pt-4 lg:pt-0',
			// isMobileScreen && 'hidden w-0'
		)}>
			{routes.map(route => (
				<NavItem
					key={route.href}
					label={route.label}
					icon={route.icon}
					href={route.href}
					isActive={pathname === route.href}
				/>
			))}
		</ul>
	)
}