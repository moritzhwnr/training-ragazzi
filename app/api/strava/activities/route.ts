import { auth } from "@/auth"; 
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handle GET requests to this route.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @returns {Response} - The response object containing the fetched activities or an error message.
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate the user and get the session information
    const session = await auth(); // get accessToken 

    // Log the start and end date query parameters for debugging purposes
    console.log(req.nextUrl.searchParams.get('start'));
    console.log(req.nextUrl.searchParams.get('end'));

    // Extract and convert the 'start' and 'end' query parameters to UNIX timestamps
    const startDate = (new Date(req.nextUrl.searchParams.get('start') as string)).getTime() / 1000;
    const endDate = (new Date(req.nextUrl.searchParams.get('end') as string)).getTime() / 1000;

    // If the session is not available, return an unauthorized response
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Construct the URL to fetch activities from Strava's API using the start and end dates
    const activitiesUrl = `https://www.strava.com/api/v3/athlete/activities?after=${startDate}&before=${endDate}`;

    // Fetch the activities from Strava's API
    const res = await fetch(activitiesUrl, { 
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.user.token}`, // Include the authorization token in the request headers
      }
    });

    // If the response is not okay, throw an error
    if (!res.ok) {
      throw new Error(`Fetch error: ${res.statusText}`);
    }

    // Parse the JSON response from Strava's API
    const data = await res.json();
    console.log(data);

    // Return the fetched data as a JSON response with status 200 (OK)
    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (e) {
    // Log the error and return a 500 (Internal Server Error) response
    console.log(e);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
