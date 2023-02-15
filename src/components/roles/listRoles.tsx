import { Modal, Table } from "@mantine/core";
import { api } from "../../utils/api";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { EditRole } from "./editRole";
import { roleSortMethods, RoleSortMethods } from "../../utils/sort/roleSort";
import type { department, role } from "@prisma/client";
type ListRoleProps = {
  roles:
    | (role & {
        department: department;
        _count: {
          employee: number;
        };
      })[]
    | undefined;
};

export const ListRoles: React.FC<ListRoleProps> = ({ roles }) => {
  const [roleId, setRoleId] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [sortMethod, setSortMethod] = useState<RoleSortMethods>("none");
  const refetch = api.role.getAll.useQuery().refetch;
  const deleteRoleDb = api.role.delete.useMutation({
    onSuccess: async () => {
      await refetch()
      .catch(err=>{
        console.log(err)
      })
    },
  });
  const deleteRole = (id: number) => {
    deleteRoleDb.mutateAsync({ id });
  };
  return (
    <>
      <Table withColumnBorders>
        <thead>
          <tr className="font-bold">
            <th
              className="hover:bg-indigo-200"
              onClick={() => {
                setSortMethod((prev) => {
                  if (prev == "idAcending") return "idDecending";
                  return "idAcending";
                });
              }}
            >
              Id
            </th>
            <th
              className="hover:bg-indigo-200"
              onClick={() => {
                setSortMethod((prev) => {
                  if (prev == "titleAcending") return "titleDecending";
                  return "titleAcending";
                });
              }}
            >
              Name
            </th>
            <th
              className="hover:bg-indigo-200"
              onClick={() => {
                setSortMethod((prev) => {
                  if (prev == "departmentAcending")
                    return "departmentDecending";
                  return "departmentAcending";
                });
              }}
            >
              Department
            </th>
            <th
              className="hover:bg-indigo-200"
              onClick={() => {
                setSortMethod((prev) => {
                  if (prev == "salaryAcending") return "salaryDecending";
                  return "salaryAcending";
                });
              }}
            >
              Salary
            </th>
            <th
              className="hover:bg-indigo-200"
              onClick={() => {
                setSortMethod((prev) => {
                  if (prev == "numberOfEmployeesAcending")
                    return "numberOfEmployeesDecending";
                  return "numberOfEmployeesAcending";
                });
              }}
            >
              Number of employees
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles?.sort(roleSortMethods[sortMethod].method).map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.title}</td>
              <td>{role.department.name}</td>
              <td>{role.salary.toNumber()}</td>
              <td>{role._count.employee}</td>

              <td>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <IconTrash
                    cursor={"pointer"}
                    onClick={() => {
                      deleteRole(role.id);
                    }}
                  />
                  <IconEdit
                    cursor="pointer"
                    onClick={() => {
                      setRoleId(role.id);
                      setOpen(true);
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal opened={open} centered onClose={() => setOpen(false)}>
        <EditRole roleId={roleId} setOpen={setOpen} />
      </Modal>
    </>
  );
};
