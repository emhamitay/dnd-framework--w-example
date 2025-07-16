import UserView from "./User";
import { useDrop } from "../framework/useDrop";
import useUserStore from "../store/useUsersStore";
import { useSortableDrop } from "../framework/useSortableDrop";

/**
 * Renders a group container that acts as a drop zone for users.
 * When a user is dropped into this group, moveUser is triggered.
 *
 * @param {Object} props
 * @param {Object} props.group - Group data containing users and ID
 */
export default function Group({ group }) {
  const users = group.users;
  const moveUser = useUserStore((s) => s.moveUser);
  const updateGroupUsers = useUserStore((s) => s.updateGroupUsers);
  const { dropRef, isOver } = useDrop({
    id: group.id,
    onDrop: (item) => {
      // Prevent drop if user is already in this group
      if (users.some((u) => u.id === item.id)) return;
      // Move the user (dragged item) into this group
      moveUser(item.id, group.id);
    },
  });

  const sortId = useSortableDrop({
    items: group.users,
    onSorted: (newUsers) => {
      console.log(newUsers);
      updateGroupUsers(group.id, newUsers);
    }
  });

  return (
    <div
      ref={dropRef}
      className={`flex flex-col p-5 gap-10 border-blue-100 rounded-2xl shadow 
        ${isOver ? "border-4" : "border"}`}
    >
      <h3 className="mb-0">group {group.index}: </h3>
      {users.map((u) => (
        <UserView sortId={sortId} user={u} key={u.id} />
      ))}
    </div>
  );
}
