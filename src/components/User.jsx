import Draggable from "../framework/Draggable";
//import { useDrag } from "../framework/useDrag";

export default function User({ user }) {
    //const { onMouseDown } = useDrag({ id: user.id });
    
  return (
    <Draggable id={user.id}>
        <div
        //onMouseDown={ onMouseDown }
        className="w-52 p-5 bg-blue-50 border-1 border-blue-100 rounded-2xl shadow"
        >
        `{user.name}`
        </div>
    </Draggable>
  );
}
