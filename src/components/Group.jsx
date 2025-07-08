import UserView from "./User";
import { useDrop } from "../framework/useDrop";
import Droppable from "../framework/Droppable";

export default function Group({ users, id }) {
  const { dropRef, isOver } = useDrop({
    id,
    onDrop: (data) => {
      console.log("dropped", data);
    }, 
  });

  return (
    <div
      ref={dropRef}
      className={`flex flex-col p-5 gap-10 border-blue-100 rounded-2xl shadow 
            ${isOver ? "border-4" : "border"}
        `}
    >
      {users.map((u) => (
        <UserView user={u} key={u.id} />
      ))}
    </div>
  );
}
