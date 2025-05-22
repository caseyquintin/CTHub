import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

interface InlineEditCellProps {
  value: any;
  row: any;
  column: any;
  onEdit: (rowIndex: number, columnId: string, value: any) => void;
  isEditing: boolean;
  onStartEdit: () => void;
}

export const InlineEditCell: React.FC<InlineEditCellProps> = ({
  value,
  row,
  column,
  onEdit,
  isEditing,
  onStartEdit,
}) => {
  const { state } = useAppContext();
  const { dropdownOptions } = state;
  const [editValue, setEditValue] = useState(value || '');
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Get dropdown options for specific fields
  const getOptionsForField = (columnId: string) => {
    switch (columnId) {
      case 'CurrentStatus':
        return dropdownOptions.filter(opt => opt.Category === 'Status' && opt.IsActive);
      case 'ContainerSize':
        return dropdownOptions.filter(opt => opt.Category === 'ContainerSize' && opt.IsActive);
      case 'Rail':
        return [{ Id: 1, Value: 'Yes' }, { Id: 0, Value: 'No' }];
      default:
        return [];
    }
  };

  // Determine if this field should use a dropdown
  const shouldUseDropdown = (columnId: string) => {
    return ['CurrentStatus', 'ContainerSize', 'Rail'].includes(columnId);
  };


  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Handle value change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditValue(e.target.value);
  };

  // Handle key press events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEdit(row.index, column.id, editValue);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditValue(value || '');
      onStartEdit(); // Close edit mode
    }
  };

  // Handle blur event
  const handleBlur = () => {
    onEdit(row.index, column.id, editValue);
  };

  if (isEditing) {
    if (shouldUseDropdown(column.id)) {
      const options = getOptionsForField(column.id);
      return (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={editValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full p-1 pr-8 border border-gray-300 rounded text-xs"
          autoComplete="off"
        >
          <option value=""></option>
          {options.map(option => (
            <option key={option.Id} value={option.Value}>
              {option.Value}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={editValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full p-1 border border-gray-300 rounded text-xs"
          autoComplete="off"
        />
      );
    }
  }

  return (
    <div className="w-full cursor-pointer" onClick={onStartEdit}>
      {value || <span className="text-gray-400">-</span>}
    </div>
  );
};