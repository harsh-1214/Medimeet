import { Navigation } from './navigation'
import { Toggle } from './toggle'
import { Wrapper } from './wrapper'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function Sidebar() {

	const { sessionClaims } = await auth();

	if(!sessionClaims || !sessionClaims.metadata || !sessionClaims.metadata.role){
		console.error('Please Setup Your Profile First')
		redirect('/profile-setup')
	}

  	const role = sessionClaims.metadata.role.toLowerCase();

	return (
		<>
			<Wrapper>
				<Toggle />
				<Navigation role = {role}/>
			</Wrapper>
		</>
	)
}