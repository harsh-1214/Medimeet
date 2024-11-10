import Link from 'next/link'
import { Clapperboard } from 'lucide-react'
import { SignedIn, SignInButton, UserButton, } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { currentUser } from '@clerk/nextjs/server'

export async function Actions() {

	const user = await currentUser()	

	return (
		<div className='flex items-center justify-end gap-x-2 ml-4 lg:ml-0'>
			{!user && (
				<SignInButton>
					<Button size='sm' variant={'default'}>
						Login
					</Button>
				</SignInButton>
			)}
			{!!user && (
				<div className='flex items-center gap-x-4'>
					<Button
						size='sm'
						variant='ghost'
						className='text-muted-foreground hover:text-primary'
						asChild
					>
						<Link href={`/u/dashboard`}>
							<Clapperboard className='h-5 w-5 lg:mr-2' />
							<span className='hidden lg:block'>Dashboard</span>
						</Link>
					</Button>
					{/* this Signed in COmpoent will check if user is signed in or not if yes then it renders the childrens */}
					{/* <SignedIn> */}
						<UserButton afterSignOutUrl='/' />
					{/* </SignedIn> */}
				</div>
			)}
		</div>
	)
}