
import React from 'react';
import PersonListItem from './PersonListItem';
import { SelectedPeopleListProps } from './types';

const SelectedPeopleList: React.FC<SelectedPeopleListProps> = ({
  people,
  onRemove,
  onUpdateRole,
  onLink,
  linkedPersonIds
}) => {
  if (people.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md text-muted-foreground">
        No people are currently associated with this company
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {people.map(person => (
        <PersonListItem
          key={person.id}
          person={person}
          onRemove={onRemove}
          onUpdateRole={onUpdateRole}
          onLink={onLink}
          isLinked={linkedPersonIds.includes(person.id)}
        />
      ))}
    </div>
  );
};

export default SelectedPeopleList;
