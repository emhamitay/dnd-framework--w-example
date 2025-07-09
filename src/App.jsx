import useUserStore from "./store/useUsersStore";
import Group from "./components/Group";
import { DndProvider } from "./framework/DndProvider";
import { GhostLayer } from "./framework/GhostLayer";

function App() {
  const groups = useUserStore((s) => s.groups);
  const addGroup = useUserStore((s) => s.addGroup);
  return (
    <DndProvider>
      <GhostLayer />
      <div className="flex flex-col w-screen h-screen items-center gap-3">
        <div className="flex flex-row justify-center items-center m-5 w-screen h-10">
          <button onClick={()=>{
            addGroup();
          }}>Add Group</button>
        </div>
        <div className="flex flex-row flex-1 justify-center items-center gap-3">
          { groups.map((g) => (
            <Group key={g.id} group={g} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
