import UserView from "./User";
import useUserStore from "../store/useUsersStore";
import { DroppableSortableWrapper } from "../framework/wrappers/DroppableSortableWrapper";

const Css_Flex_Row =
  "flex flex-row p-5 gap-10 border-blue-100 rounded-2xl shadow ";
const Css_Flex_Col =
  "flex flex-col p-5 gap-10 border-blue-100 rounded-2xl shadow ";
const Css_Grid =
  "grid grid-cols-3 grid-rows-3 gap-5 p-5 border-blue-100 rounded-2xl shadow ";
const header_flex = "mb-0";
const header_grid = "col-span-3 mb-2";

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

  const callback = (item) => {
    // Prevent drop if user is already in this group
    if (users.some((u) => u.id === item.id)) return;
    // Move the user (dragged item) into this group
    moveUser(item.id, group.id);
  };

  function onSortCallback(newUsers) {
    console.log('callback called');
    updateGroupUsers(group.id, newUsers);
  }

  return (
    <DroppableSortableWrapper items={users} onSorted={onSortCallback} onDrop={callback}>
      <div className={`${Css_Flex_Col}`}>
        <h3 className={header_grid}>group {group.index}: </h3>
        {users.map((u) => (
          <UserView user={u} key={u.id} />
        ))}
      </div>
    </DroppableSortableWrapper>
  );
}

/*

*/
