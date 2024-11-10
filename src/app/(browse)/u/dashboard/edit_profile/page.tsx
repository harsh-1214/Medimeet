// 'use client'

// import { getPatientProfile, updatePatientProfile } from '@/actions/user'
import EditForm from './_components/form'
import { useEffect } from 'react'


const EditProfile = async () => {


  // TODO , Convert this section to call API, so that after receiving I can show toast,

  // I want to show toast after updating profile
  
  // Clerk has option of updating profile, update the route for it.

  // const [first_name

  // useEffect( () => {

  //   async function f(){

    // const patient = await getPatientProfile()
  //   } 
  //   f()

  // },[])


  async function handleSubmit(formData : FormData){
    'use server'

    const payload = {
      first_name : formData.get('first_name')?.toString() ?? undefined,
      last_name : formData.get('last_name')?.toString() ?? undefined,
      email : formData.get('email')?.toString() ?? undefined,
    }

    // await updatePatientProfile(payload);
  }

  return (
    // <EditForm 
    //   first_name = {patient.first_name}
    //   last_name= {patient.last_name}
    //   email= {patient.email}
    //   handleSubmit={handleSubmit}

    // />
    <>
    <EditForm/>
    </>
  )
}

export default EditProfile
