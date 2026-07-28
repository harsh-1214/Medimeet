import Link from 'next/link'
import { Clapperboard } from 'lucide-react'
import { SignInButton, UserButton, } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { currentUser } from '@clerk/nextjs/server'

export async function Actions() {
	let user = null;
	try {
		user = await currentUser()	
	} catch (err) {
		// gracefully handle the error , if there is network issue or any other issue in fetching the user info then we will set the user to null and render the login button , just make them login again.
		user = null;
	}

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