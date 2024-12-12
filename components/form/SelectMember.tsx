"use client";

import { memberType } from "@/lib/types";
import React, { useState, useEffect, useRef } from "react";

interface MemberSelectProps {
  members: memberType[];
  onSelect: (member: number) => void;
  initialSelectedMemberId?: number | null;
}

export function MemberSelect({
  members,
  onSelect,
  initialSelectedMemberId,
}: MemberSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<memberType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSelectedMemberId) {
      const member = members.find((m) => m.id === initialSelectedMemberId);
      if (member) {
        setSelectedMember(member);
      }
    }
  }, [initialSelectedMemberId, members]);

  const getMostRecentRole = (rolesByPeriod: memberType["rolesByPeriod"]) => {
    const periods = Object.keys(rolesByPeriod).sort().reverse();
    return periods.length > 0 ? rolesByPeriod[periods[0]] : undefined;
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectMember = (member: memberType) => {
    setSelectedMember(member);
    onSelect(member.id);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full mt-8 z-50 max-w-3xl " ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-200">
        Velg forfatter
      </label>
      <button
        className="w-full px-4 py-2 text-left bg-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedMember ? selectedMember.name : "Velg forfatter..."}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full max-w-md mt-1 bg-gray-700 border border-gray-300 rounded-md shadow-lg">
          <input
            type="text"
            className="w-full px-4 py-2 bg-gray-800 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Søk etter medlemmer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="max-h-60 max-w-lg w-full overflow-auto">
            {filteredMembers.map((member) => (
              <li
                key={member.id}
                className="px-4 py-2 hover:bg-gray-900 cursor-pointer"
                onClick={() => handleSelectMember(member)}
              >
                {member.name}
                {getMostRecentRole(member.rolesByPeriod) && (
                  <span className="ml-2 text-sm text-gray-200">
                    ({getMostRecentRole(member.rolesByPeriod)})
                  </span>
                )}
              </li>
            ))}
            {filteredMembers.length === 0 && (
              <li className="px-4 py-2 text-gray-500">No members found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
