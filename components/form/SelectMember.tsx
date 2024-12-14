"use client";

import { memberType, RoleByPeriodType } from "@/lib/types";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

interface MemberSelectProps {
  onSelect: (member: number) => void;
  onSelectName?: (member: string) => void;
  initialSelectedMemberId?: number | null;
  isBlog?: boolean;
}

export function MemberSelect({
  onSelect,
  onSelectName,
  initialSelectedMemberId,
  isBlog,
}: MemberSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<memberType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [members, setMembers] = useState<memberType[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/admin/member");
        if (response.ok) {
          const data = await response.json();

          //eslint-disable-next-line
          const normalizedMembers = data.members.map((member: any) => {
            return {
              ...member,
              rolesByPeriod: Array.isArray(member.rolesByPeriod)
                ? //eslint-disable-next-line
                  member.rolesByPeriod.map((pr: any) => ({
                    id: pr.id,
                    period: pr.period,
                    role: pr.role,
                  }))
                : [],
            };
          });

          // Sort members based on the latest period's end year
          normalizedMembers.sort((a: memberType, b: memberType) => {
            const getLatestYear = (member: memberType) => {
              if (member.rolesByPeriod && member.rolesByPeriod.length > 0) {
                const latestPeriod = member.rolesByPeriod.reduce(
                  (latest, current) => {
                    const currentEndYear = parseInt(
                      current.period.split(" - ")[1],
                      10
                    );
                    const latestEndYear = latest
                      ? parseInt(latest.split(" - ")[1], 10)
                      : 0;
                    return currentEndYear > latestEndYear
                      ? current.period
                      : latest;
                  },
                  ""
                );
                return latestPeriod
                  ? parseInt(latestPeriod.split(" - ")[1], 10)
                  : 0;
              }
              return 0;
            };

            return getLatestYear(b) - getLatestYear(a);
          });

          setMembers(normalizedMembers);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Klarte ikke å hente medlemmer: ${error.message}`);
        } else {
          toast.error("Klarte ikke å hente medlemmer");
        }
      } finally {
        if (initialSelectedMemberId) {
          const member = members.find((m) => m.id === initialSelectedMemberId);
          if (member) {
            setSelectedMember(member);
          }
        }
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    if (initialSelectedMemberId) {
      const member = members.find((m) => m.id === initialSelectedMemberId);
      if (member) {
        setSelectedMember(member);
      }
    }
  }, [initialSelectedMemberId, members]);

  const getMostRecentRole = (rolesByPeriod: memberType["rolesByPeriod"]) => {
    if (!rolesByPeriod || rolesByPeriod.length === 0) return undefined;
    const latestRole = rolesByPeriod.reduce((latest, current) => {
      const currentEndYear = parseInt(current.period.split(" - ")[1], 10);
      const latestEndYear = latest
        ? parseInt(latest.period.split(" - ")[1], 10)
        : 0;
      return currentEndYear > latestEndYear ? current : latest;
    }, null as RoleByPeriodType | null);
    return latestRole ? latestRole.role : undefined;
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectMember = (member: memberType) => {
    //eslint-disable-next-line
    setSelectedMember(member);
    onSelect(member.id);
    //eslint-disable-next-line
    onSelectName && onSelectName(member.name);
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
    <div className="w-full mt-8 z-50  relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-200">
        {`Velg ${isBlog ? "forfatter" : "medlem"}`}
      </label>
      <button
        type="button"
        className="w-full px-4 py-2 text-left bg-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedMember
          ? selectedMember.name
          : `Velg ${isBlog ? "forfatter" : "medlem"}`}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full  mt-1 bg-gray-700 border border-gray-300 rounded-md shadow-lg">
          <input
            type="text"
            className="w-full px-4 py-2 bg-gray-800 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Søk etter medlemmer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {members ? (
            <ul className="max-h-60 w-full overflow-auto">
              {filteredMembers.map((member) => (
                <li
                  key={member.id}
                  className="px-4 py-2 hover:bg-gray-900 cursor-pointer flex justify-between items-center"
                  onClick={() => handleSelectMember(member)}
                >
                  <span>{member.name}</span>
                  {getMostRecentRole(member.rolesByPeriod) && (
                    <span className="ml-2 text-sm text-gray-200">
                      ({getMostRecentRole(member.rolesByPeriod)})
                    </span>
                  )}
                </li>
              ))}
              {filteredMembers.length === 0 && (
                <li className="px-4 py-2 text-gray-500">
                  Ingen medlemmer funnet
                </li>
              )}
            </ul>
          ) : (
            <div className="text-white flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2  mb-4"></div>
                <h2 className="text-2xl font-semibold">
                  Laster inn medlemmer...
                </h2>
                <p className="text-slate-400 mt-2">
                  Vennligst vent mens vi henter medlemmer
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
