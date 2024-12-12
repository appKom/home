"use client";

import { useState, useRef, useEffect } from "react";
import { UserPlus, Upload, XIcon, Edit } from "lucide-react";
import toast from "react-hot-toast";
import TextInput from "@/components/form/TextInput";
import OptionsBox from "@/components/form/OptionsBox";
import Checkbox from "@/components/form/Checkbox";
import Table from "@/components/form/Table";
import Image from "next/image";
import { memberType } from "@/lib/types";
import TextAreaInput from "@/components/form/TextAreaInput";

const AdminMemberPage = () => {
  const [members, setMembers] = useState<memberType[]>([]);
  const [editingMember, setEditingMember] = useState<memberType | null>(null);

  const [name, setName] = useState("");
  const [quote, setQuote] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCurrent, setIsCurrent] = useState(true);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const roles = ["Leder", "Nestleder", "Økonomiansvarlig", "Medlem"] as const;
  const [isLoading, setIsLoading] = useState(true);

  // State for multiple period-role pairs
  const [periodRoles, setPeriodRoles] = useState<
    {
      period: string;
      role: "Leder" | "Nestleder" | "Økonomiansvarlig" | "Medlem";
    }[]
  >([{ period: `${currentYear - 1} - ${currentYear}`, role: "Medlem" }]);

  // Function to generate period options
  const generatePeriods = (startYear: number, count: number) => {
    const periods = [];
    for (let i = 0; i < count; i++) {
      const yearStart = startYear - i;
      const yearEnd = yearStart + 1;
      periods.push(`${yearStart} - ${yearEnd}`);
    }
    return periods;
  };

  const periodOptions = generatePeriods(currentYear, 10).map((period) => ({
    value: period,
    label: period,
  }));

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/admin/member");
        if (response.ok) {
          const data = await response.json();
          const normalizedMembers = data.members.map((member: any) => {
            if (Array.isArray(member.rolesByPeriod)) {
              const rolesByPeriodObject: {
                [period: string]:
                  | "Leder"
                  | "Nestleder"
                  | "Økonomiansvarlig"
                  | "Medlem";
              } = {};
              member.rolesByPeriod.forEach((pr: any) => {
                rolesByPeriodObject[pr.period] = pr.role;
              });
              return { ...member, rolesByPeriod: rolesByPeriodObject };
            }
            return member;
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
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleEdit = (member: memberType) => {
    setEditingMember(member);
    setName(member.name);
    setQuote(member.quote || "");
    setAbout(member.about || "");
    setIsCurrent(member.isCurrent);
    setSelectedYear(
      member.isCurrent
        ? currentYear
        : parseInt(
            Object.keys(member.rolesByPeriod).slice(-1)[0].split(" - ")[1]
          )
    );
    setImagePreview(member.imageUri || null);
    setImage(null);

    const sortedPeriods = Object.keys(member.rolesByPeriod).sort();
    const populatedPeriodRoles = sortedPeriods.map((period) => ({
      period,
      role: member.rolesByPeriod[period],
    }));
    setPeriodRoles(populatedPeriodRoles);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const rolesByPeriod = periodRoles.map((pr) => ({
      period: pr.period,
      role: pr.role,
    }));

    const formData = new FormData();
    formData.append("name", name);
    formData.append("rolesByPeriod", JSON.stringify(rolesByPeriod));

    if (quote !== "") {
      formData.append("quote", quote);
    }

    if (about !== "") {
      formData.append("about", about);
    }

    formData.append("isCurrent", isCurrent.toString());

    if (image) {
      formData.append("image", image);
    }

    try {
      let response;

      if (editingMember) {
        formData.append("id", editingMember.id.toString());
        response = await fetch("/api/admin/member", {
          method: "PUT",
          body: formData,
        });
      } else {
        response = await fetch("/api/admin/member", {
          method: "POST",
          body: formData,
        });
      }

      if (response.ok) {
        toast.success(editingMember ? "Medlem oppdatert" : "Medlem lagt til!");
        resetForm();

        const responseData = await response.json();
        if (editingMember) {
          setMembers(
            members.map((member) =>
              member.id === editingMember.id ? responseData.member : member
            )
          );
        } else {
          setMembers(
            [...members, responseData.member].sort(
              (a, b) =>
                new Date(b.rolesByPeriod[0].period.split(" - ")[1]).getTime() -
                new Date(a.rolesByPeriod[0].period.split(" - ")[1]).getTime()
            )
          );
        }

        setEditingMember(null);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(
          `Failed to ${editingMember ? "update" : "add"} member: ${
            error.message
          }`
        );
      } else {
        toast.error(
          editingMember
            ? "Klarte ikke å oppdatere medlem"
            : "Klarte ikke å legge til medlem"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    const confirmed = window.confirm(
      "Er du sikker på at du vil slette dette medlemmet?"
    );
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch("/api/admin/member", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setMembers(members.filter((member) => member.id !== id));
        toast.success("Medlem fjernet!");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to remove member: ${error.message}`);
      } else {
        toast.error("Failed to remove member");
      }
    }
  };

  const resetForm = () => {
    setName("");
    setImage(null);
    setImagePreview(null);
    setAbout("");
    setQuote("");
    setIsCurrent(true);
    setSelectedYear(currentYear);
    setPeriodRoles([
      { period: `${currentYear - 1} - ${currentYear}`, role: "Medlem" },
    ]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addPeriodRole = () => {
    const existingPeriods = periodRoles.map((pr) => pr.period);
    const availablePeriods = periodOptions.filter(
      (period) => !existingPeriods.includes(period.value)
    );

    if (availablePeriods.length === 0) {
      toast.error("Ingen flere tilgjengelige perioder å legge til.");
      return;
    }

    const newPeriod = availablePeriods[0].value;
    setPeriodRoles([
      ...periodRoles,
      {
        period: newPeriod,
        role: "Medlem",
      },
    ]);
  };

  const removePeriodRole = (index: number) => {
    const updated = [...periodRoles];
    updated.splice(index, 1);
    setPeriodRoles(updated);
  };

  const updatePeriodRole = (
    index: number,
    field: "period" | "role",
    value: string
  ) => {
    const updated = [...periodRoles];
    if (field === "role") {
      updated[index].role = value as
        | "Leder"
        | "Nestleder"
        | "Økonomiansvarlig"
        | "Medlem";
    } else {
      updated[index].period = value;
    }
    setPeriodRoles(updated);
  };

  const columns = [
    {
      header: "Navn",
      accessor: "name" as keyof memberType,
    },
    {
      header: "Bilde",
      accessor: "imageUri" as keyof memberType,
      renderCell: (member: memberType) =>
        member.imageUri ? (
          <Image
            height={50}
            width={50}
            src={member.imageUri}
            alt={member.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-700">N/A</span>
          </div>
        ),
    },
    {
      header: "Rolle(r)",
      accessor: "rolesByPeriod" as keyof memberType,
      renderCell: (member: memberType) => {
        const sortedPeriods = Object.keys(member.rolesByPeriod).sort();
        return (
          <ul className="list-disc list-inside">
            {sortedPeriods.map((period) => (
              <li key={period}>
                {period}: {member.rolesByPeriod[period]}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      header: "Status",
      accessor: "isCurrent" as keyof memberType,
      renderCell: (member: memberType) =>
        member.isCurrent ? "Aktiv" : `Inaktiv`,
    },
  ];

  const tableData = members.map((member) => ({
    ...member,
    rolesByPeriod: member.rolesByPeriod,
  }));

  return (
    <div className="p-4 w-full items-start">
      <h1 className="text-2xl font-bold mb-4">Administrer medlemmer</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <TextInput
          id="name"
          label="Navn"
          defaultValue={name}
          updateInputValues={(value: string) => setName(value)}
          required
          size="medium"
        />
        <TextInput
          id="quote"
          label="Quote"
          defaultValue={quote}
          updateInputValues={(value: string) => setQuote(value)}
          size="medium"
        />
        <TextAreaInput
          id={"about"}
          label={"Om"}
          value={about}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setAbout(e.target.value)
          }
        />

        <div>
          <div className="flex items-center gap-4 mt-4">
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            {isCurrent && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Upload className="inline-block mr-2 h-4 w-4" />
                Last opp bilde
              </button>
            )}
            {imagePreview && isCurrent && (
              <Image
                src={imagePreview}
                alt="Preview"
                height={40}
                width={40}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
          </div>
        </div>

        <div>
          {periodRoles.map(
            (
              pr: {
                period: string;
                role: "Leder" | "Nestleder" | "Økonomiansvarlig" | "Medlem";
              },
              index
            ) => (
              <div key={index} className="flex justify-between my-4">
                <OptionsBox
                  id={`period-${index}`}
                  label="Periode"
                  value={pr.period}
                  onChange={(e) =>
                    updatePeriodRole(index, "period", e.target.value)
                  }
                  required
                  options={periodOptions}
                />
                <OptionsBox
                  label="Rolle"
                  value={pr.role}
                  onChange={(e) =>
                    updatePeriodRole(index, "role", e.target.value)
                  }
                  required
                  options={roles.map((role) => ({ value: role, label: role }))}
                />
                {periodRoles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePeriodRole(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            )
          )}
          <button
            type="button"
            onClick={addPeriodRole}
            className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Legg til periode
          </button>
        </div>

        <Checkbox
          id="current-member"
          label="Aktivt medlem"
          checked={isCurrent}
          onChange={(e) => setIsCurrent(e.target.checked)}
        />

        {!isCurrent && (
          <OptionsBox
            label="Aktivt år"
            value={selectedYear.toString()}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            options={years.map((year) => ({
              value: year.toString(),
              label: year.toString(),
            }))}
          />
        )}

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {editingMember ? (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Oppdater medlem
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Legg til medlem
            </>
          )}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Medlemsliste</h2>
      {isLoading ? (
        <div className="text-white flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-y-2 border-onlineyellow mb-4"></div>
            <h2 className="text-2xl font-semibold">Laster inn medlemmer...</h2>
          </div>
        </div>
      ) : (
        <Table
          columns={columns}
          data={tableData}
          renderRowActions={(member: memberType) => (
            <>
              <button
                onClick={() => handleEdit(member)}
                className="text-blue-500 hover:text-blue-700 mr-2"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleRemove(member.id)}
                className="text-red-500 hover:text-red-700"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </>
          )}
        />
      )}
    </div>
  );
};

export default AdminMemberPage;
