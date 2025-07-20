// components/User.jsx
//import { Draggable } from "../framework/wrappers/Draggable";
import { SortableDraggable } from "../framework/wrappers/SortableDraggable";

/**
 * A draggable User component.
 * Uses the custom useDrag hook to register drag behavior on mouse down.
 *
 * @param {Object} props
 * @param {Object} props.user - The user object with id, name, groupId, etc.
 */
export default function User({ sortId, user }) {
  //const { onMouseDown } = useDrag({ id: user.id, sortId , data: { id: user.id } });
  //const { ref } = useSortable({id : user.id, direction: SORT_DIRECTION.Grid})

  return (
    <SortableDraggable id={user.id} sortId={sortId}>
      <div className="w-52 p-5 bg-blue-50 border border-blue-100 rounded-2xl shadow cursor-grab">
        {user.index} : {user.name}
      </div>
    </SortableDraggable>
  );
}

/*

NO SORTABLE
      <Draggable id={user.id} sortId={sortId}>
        <div
          className="w-52 p-5 bg-blue-50 border border-blue-100 rounded-2xl shadow cursor-grab"
        >
          {user.index} : {user.name}
        </div>
      </Draggable>

*/
