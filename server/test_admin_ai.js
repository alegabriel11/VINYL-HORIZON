fetch('http://localhost:5000/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: "Hola", isAdmin: true })
}).then(res => res.json()).then(data => console.log(data)).catch(err => console.error(err));
