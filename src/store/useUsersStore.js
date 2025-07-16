import { create } from "zustand";
import Group from "../model/userGroup";
import User from "../model/user";

/**
 * Zustand store managing user groups and user movements between groups.
 */
const useUserStore = create((set, get) => ({
  groups: Initialize(),

  /**
   * Adds a new empty group.
   */
  addGroup: () => {
    const groups = get().groups;
    const newGroup = new Group(groups.length);
    set({ groups: [...groups, newGroup] });
  },

  /**
   * Update the chosen group into the new group
   * @param {Number} groupId the id of the group to be updated
   * @param {User[]} newUsers new array of the updated users
   */
  updateGroupUsers: (groupId, newUsers) => {
    const groups = get().groups;
    const groupIndex = groups.findIndex((g) => g.id === groupId);

    if (groupIndex !== -1) {
      // Update indexes based on newUsers position
      newUsers.forEach((user, i) => (user.index = i));
      groups[groupIndex].users = newUsers;

      set({ groups: [...groups] }); // trigger re-render
    } else {
      console.warn(`updateGroupUsers: Group not found for ID ${groupId}`);
    }
  },
  updateGroups: (newGroups) =>{
    set({
      groups: newGroups
    });
  },
  /**
   * Moves a user from their current group to a specified target group.
   *
   * @param {string} userId - ID of the user to move.
   * @param {string} toGroupId - ID of the target group.
   */
  moveUser: (userId, toGroupId) => {
    const groups = get().groups;

    let userToMove = null;
    let fromGroupIndex = -1;
    let userIndex = -1;

    for (let i = 0; i < groups.length; i++) {
      const groupUsers = groups[i].users;
      const index = groupUsers.findIndex((user) => user.id === userId);
      if (index !== -1) {
        userToMove = groupUsers[index];
        fromGroupIndex = i;
        userIndex = index;
        break;
      }
    }

    const toGroup = groups.find((g) => g.id === toGroupId);

    if (userToMove && toGroup) {
      groups[fromGroupIndex].users.splice(userIndex, 1);
      groups[fromGroupIndex].users.forEach((user, i) => (user.index = i));

      userToMove.index = toGroup.users.length;
      toGroup.users.push(userToMove);

      // ✅ Call the properly scoped sorting function
      sortAllGroups(groups);

      set({ groups: [...groups] });
    } else {
      console.warn(
        `moveUser: Invalid userId (${userId}) or toGroupId (${toGroupId})`
      );
    }
  },
}));

// 🔁 Utility to keep all groups sorted by user.index
function sortAllGroups(groups) {
  groups.forEach((group) => {
    group.users.sort((a, b) => a.index - b.index);
  });
}

/**
 * Initializes the store with 1 default group.
 * @returns {Group[]} Array of groups
 */
function Initialize() {
  const groups = [];
  for (let i = 0; i < 1; i++) groups.push(new Group(i));
  return groups;
}

export default useUserStore;
