const { useState } = require('react');

const useUserSelection = () => {
  console.log('Initializing useUserSelection hook');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  const handleUserSelect = (member) => {
    console.log('handleUserSelect called with member:', { id: member.id, name: member.nombre });
    setTempSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === member.id);
      console.log('Current selection state:', { isSelected, currentUsers: prev });
      if (isSelected) {
        const newUsers = prev.filter(u => u.id !== member.id);
        console.log('Removing user from selection:', { newUsers });
        return newUsers;
      }
      const newUsers = [...prev, member];
      console.log('Adding user to selection:', { newUsers });
      return newUsers;
    });
  };

  const isUserSelected = (memberId) => {
    const selected = tempSelectedUsers.some(u => u.id === memberId);
    console.log('Checking if user is selected:', { memberId, selected });
    return selected;
  };

  const confirmSelection = () => {
    console.log('Confirming selection:', { tempSelectedUsers });
    setSelectedUsers(tempSelectedUsers);
  };

  const cancelSelection = () => {
    console.log('Canceling selection, reverting to:', { selectedUsers });
    setTempSelectedUsers([...selectedUsers]);
  };

  const removeUser = (user) => {
    console.log('Removing user from both selections:', { userId: user.id, name: user.nombre });
    setSelectedUsers(prev => {
      const newSelection = prev.filter(u => u.id !== user.id);
      console.log('Updated permanent selection:', { newSelection });
      return newSelection;
    });
    setTempSelectedUsers(prev => {
      const newTemp = prev.filter(u => u.id !== user.id);
      console.log('Updated temporary selection:', { newTemp });
      return newTemp;
    });
  };

  return {
    selectedUsers,
    tempSelectedUsers,
    handleUserSelect,
    isUserSelected,
    confirmSelection,
    cancelSelection,
    removeUser
  };
};

export default useUserSelection;