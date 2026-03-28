import { redirect } from 'next/navigation';

// Dealer registration has moved to the full application flow
export default function RegisterPage() {
  redirect('/apply');
}
