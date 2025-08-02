// app/api/users/route.ts
export async function GET(request: Request) {
  // Example data; replace with DB calls or business logic
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  // Insert user logic…
  const newUser = { id: Date.now(), ...body };
  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
