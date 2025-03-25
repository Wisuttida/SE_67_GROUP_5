import React from 'react';

interface DropdownListProps {
  label: string;
  id: string;
  list: Array<{ id: string; name_th: string; name_en: string }>;
  child?: string;
  childsId?: string[];
  setChilds?: React.Dispatch<React.SetStateAction<any[]>>[];
  selected: { [key: string]: number | undefined };
  setSelected: React.Dispatch<React.SetStateAction<{ [key: string]: number | undefined }>>;
}

const DropdownList: React.FC<DropdownListProps> = ({
  label,
  id,
  list,
  child,
  childsId = [],
  setChilds = [],
  selected,
  setSelected,
}) => {
  const onChangeHandle = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setChilds.forEach((setChild) => setChild([]));
    const entries = childsId.map((child) => [child, undefined]);
    const unSelectChilds = Object.fromEntries(entries);

    const input = event.target.value;
    const dependId = input ? Number(input) : undefined;
    setSelected((prev) => ({ ...prev, ...unSelectChilds, [id]: dependId }));

    if (!input) return;

    if (child) {
      const parent = list.find((item) => item.id === dependId);
      if (parent) {
        const { [child]: childs } = parent;
        const [setChild] = setChilds;
        setChild(childs);
      }
    }
  };

  return (
    <>
      <label htmlFor={label}>{label}</label>
      <select value={selected[id]} onChange={onChangeHandle} className="w-full px-3 py-2 border rounded-md">
        <option label="เลือกข้อมูล ..." />
        {list &&
          list.map((item) => (
            <option
              key={item.id}
              value={item.id}
              label={`${item.name_th} - ${item.name_en}`}
            />
          ))}
      </select>
    </>
  );
};

export default DropdownList;
