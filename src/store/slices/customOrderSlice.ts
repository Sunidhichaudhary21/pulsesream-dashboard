import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadFromLocalStorage, saveToLocalStorage } from '@/src/lib/utils';

const CUSTOM_ORDER_STORAGE_KEY = 'custom_card_order_v1';

interface CustomOrderState {
  orderedIds: string[];
}

const initialState: CustomOrderState = {
  orderedIds: loadFromLocalStorage<string[]>(CUSTOM_ORDER_STORAGE_KEY, []),
};

export const customOrderSlice = createSlice({
  name: 'customOrder',
  initialState,
  reducers: {
    setCustomOrder: (state, action: PayloadAction<string[]>) => {
      state.orderedIds = action.payload;
      saveToLocalStorage(CUSTOM_ORDER_STORAGE_KEY, state.orderedIds);
    },
    reorderItems: (state, action: PayloadAction<{ activeId: string; overId: string }>) => {
      const { activeId, overId } = action.payload;
      const oldIndex = state.orderedIds.indexOf(activeId);
      const newIndex = state.orderedIds.indexOf(overId);

      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        const updated = [...state.orderedIds];
        const [movedItem] = updated.splice(oldIndex, 1);
        updated.splice(newIndex, 0, movedItem);
        state.orderedIds = updated;
        saveToLocalStorage(CUSTOM_ORDER_STORAGE_KEY, updated);
      }
    },
    resetOrder: (state) => {
      state.orderedIds = [];
      saveToLocalStorage(CUSTOM_ORDER_STORAGE_KEY, []);
    },
  },
});

export const { setCustomOrder, reorderItems, resetOrder } = customOrderSlice.actions;

export default customOrderSlice.reducer;
