// components/User.jsx
import { useDrag } from "../framework/useDrag";
import { SORT_DIRACTION, useSortable } from "../framework/useSortable";

/**
 * A draggable User component.
 * Uses the custom useDrag hook to register drag behavior on mouse down.
 *
 * @param {Object} props
 * @param {Object} props.user - The user object with id, name, groupId, etc.
 */
export default function User({ sortId , user }) {
  const { onMouseDown } = useDrag({ id: user.id, sortId , data: { id: user.id } });
  const { ref } = useSortable({id : user.id, direction: SORT_DIRACTION.Horizontal})

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className="w-52 p-5 bg-blue-50 border border-blue-100 rounded-2xl shadow cursor-grab"
    >
      {user.index} : {user.name}
    </div>
  );
}
