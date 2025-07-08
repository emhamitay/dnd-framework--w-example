import useUserStore from './store/useUsersStore';
import Group from './components/group';
import { useDndStore } from './framework/dndStore';
import { useEffect } from 'react';
import { DndProvider } from './framework/DndProvider';

function App() {

    const g1 = useUserStore((s) => s.g1);
    const g2 = useUserStore((s) => s.g2);
    const setConsoleLog = useDndStore((s) => s.setConsoleLog);

    useEffect(() => {
      setConsoleLog(true);
    }, [setConsoleLog]);

    return (
    <DndProvider>
      <div className='flex w-screen h-screen justify-center items-center gap-3' >
        <Group users={g1} id='g1' />
        <Group users={g2} id='g2' />
      </div>
    </DndProvider>
  )
}

export default App
