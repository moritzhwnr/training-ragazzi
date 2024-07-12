import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  // Await the result of the auth function to check for a valid session
  const session = await auth();

  // If a session exists, redirect to the '/analysis' page
  if (session) {
    redirect('/analysis');
  }
  // If no session exists, redirect to the '/api/auth/signin' page for authentication
  else {
    redirect('/api/auth/signin');
  }
}