import { getSelf } from '@/lib/auth-service'
import { Navigation } from './navigation'
import { Toggle } from './toggle'
import { Wrapper } from './wrapper'
import { User } from '@prisma/client'
import { redirect } from 'next/navigation'

export async function Sidebar() {

	let user : {
		patient: {
			id: string;
		} | null;
		doctor: {
			id: string;
		} | null;
	} & User

	try{
		user = await getSelf();
		if(!user.role){
			redirect('/sign-in');
		}
	}
	catch(e : any){
        console.log('Internal Server Error',e);
		redirect('/')
    }

	return (
		<>
			<Wrapper>
				<Toggle />
				<Navigation role = {user.role}/>
			</Wrapper>
		</>
	)
}