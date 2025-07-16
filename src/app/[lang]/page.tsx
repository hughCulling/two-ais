import { headers } from 'next/headers';
import LandingPage from '@/components/LandingPage';

export default async function Page() {
  const nonce = (await headers()).get('x-nonce') || '';
  return <LandingPage nonce={nonce} />;
}
