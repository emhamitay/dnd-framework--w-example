import { create } from 'zustand';
import User, { Mock } from '../model/user';

const useUserStore = create((set, get) => ({
  g1: Mock(),
  g2: Mock(),

  moveUser: (user) => {
    const { g1, g2 } = get();

    // Check if user is in g1
    if (g1.some(u => u.id === user.id)) {
      set({
        g1: g1.filter(u => u.id !== user.id),
        g2: [...g2, user]
      });
    }
    // Otherwise, check if user is in g2
    else if (g2.some(u => u.id === user.id)) {
      set({
        g2: g2.filter(u => u.id !== user.id),
        g1: [...g1, user]
      });
    }
  }
}));

export default useUserStore;