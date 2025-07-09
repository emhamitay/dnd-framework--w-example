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
    const newGroup = new Group();
    set({ groups: [...groups, newGroup] });
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

    // Locate the user and their current group
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

    // Find the target group
    const toGroup = groups.find((g) => g.id === toGroupId);

    // Perform the move if valid
    if (userToMove && toGroup) {
      // Remove from current group
      groups[fromGroupIndex].users.splice(userIndex, 1);

      // Add to target group
      toGroup.users.push(userToMove);

      // Update the store with the new groups array reference
      set({ groups: [...groups] });
    } else {
      console.warn(
        `moveUser: Invalid userId (${userId}) or toGroupId (${toGroupId})`
      );
    }
  },
}));

/**
 * Initializes the store with 2 default groups.
 * @returns {Group[]} Array of groups
 */
function Initialize() {
  const groups = [];
  for (let i = 0; i < 2; i++) groups.push(new Group());
  return groups;
}

export default useUserStore;
