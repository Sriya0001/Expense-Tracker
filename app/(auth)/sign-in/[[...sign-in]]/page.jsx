import { SignIn } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <SignIn />
    </div>
  );
}