import Chat from '../components/Chat';
import Dashboard from '../components/Dashboard';
import { FiMessageSquare } from 'react-icons/fi';

export default function Page() {
  return (
    <main className="flex flex-col md:flex-row h-screen">
      <section className="flex flex-col md:w-1/2 p-6 h-full">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <FiMessageSquare className="text-blue-400" /> AI Customer Support
        </h1>
        <div className="flex-1">
          <Chat />
        </div>
      </section>
      <section className="md:w-1/2 p-6 h-full">
        <Dashboard />
      </section>
    </main>
  );
}
