import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface Contact {
  Id: string;
  name: string;
  designation: string;
  avatar: any;
  company?: string;
  email?: string;
  phoneNumber?: string;
  description?: string;
}

interface ContactsState {
  contacts: Contact[];
}

const initialState: ContactsState = {
  contacts: [
    {
      Id: '1',
      name: 'John Doe',
      designation: 'Software Engineer',
      avatar: ''
    },
    // Add more initial contacts if needed
  ],
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setcontacts: (state, action) => {
      state.contacts = action.payload
    },
    addContact(state, action: PayloadAction<Contact>) {
      state.contacts.push(action.payload);
    },
    deleteContact(state, action: PayloadAction<string>) {
      state.contacts = state.contacts.filter(contact => contact.Id !== action.payload);
    }
  },
});

export const { addContact, setcontacts } = contactsSlice.actions;

export default contactsSlice.reducer;
