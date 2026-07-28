import { SignIn } from "@clerk/nextjs";

export default function Page() {

  return (
    <div>
      <SignIn signUpForceRedirectUrl = {'/profile-setup'} />
    </div>
  );
}
