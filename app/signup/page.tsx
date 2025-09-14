import SignupComponent from './_components/SignupComponent.client';

export async function generateMetadata() {
  return { title: `회원 가입` };
}

export default function SignupPage() {
  return <SignupComponent />;
}
