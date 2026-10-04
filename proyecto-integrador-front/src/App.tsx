import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { SessionProvider } from '@/session/SessionProvider';

function App() {
  return (
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  );
}

export { App };
