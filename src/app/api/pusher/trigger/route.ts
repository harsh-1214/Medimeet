import { NextResponse } from 'next/server';
import Pusher from 'pusher';

// Initialize the Pusher backend instance
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  try {
    const { roomId, eventName, data } = await req.json();

    // Trigger the event on a specific channel.
    // Channel name: 'room-123'
    // Event name: 'peer-joined'
    // Data: { peerId: '...' }
    await pusher.trigger(`room-${roomId}`, eventName, data);

    return NextResponse.json({ success: true } , {status: 200});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to trigger event' }, { status: 500 });
  }
}