import Chat from '../components/Chat';
import Dashboard from '../components/Dashboard';

export default function Page() {
  return (
    <main className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">AI Customer Support</h1>
        <Chat />
      </div>
      <Dashboard />
    </main>
  );
}
