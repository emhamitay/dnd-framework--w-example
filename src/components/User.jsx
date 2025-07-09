// components/User.jsx
import { useDrag } from "../framework/useDrag";

/**
 * A draggable User component.
 * Uses the custom useDrag hook to register drag behavior on mouse down.
 *
 * @param {Object} props
 * @param {Object} props.user - The user object with id, name, groupId, etc.
 */
export default function User({ user }) {
  const { onMouseDown } = useDrag({
    id: user.id,
    type: "user", // Type used to differentiate draggable item types
    data: {
      name: user.name,
      groupId: user.groupId,
    },
  });

  return (
    <div
      onMouseDown={onMouseDown}
      className="w-52 p-5 bg-blue-50 border border-blue-100 rounded-2xl shadow cursor-grab"
    >
      {user.name}
    </div>
  );
}
