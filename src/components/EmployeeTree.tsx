"use client";

import { useEmployee } from "@/zustand/store";
import React from "react";
import { levels } from "@/lib/utils";
import { EmployeeProps } from "@/zustand/store";

interface nodeProps {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  level: string;
  managerId: string | null;
  team: string | null;
  subordinates: nodeProps | null;
}

interface subordinatesProps {
  email: string;
  id: string;
  level: string;
  managerId: string;
  name: string;
  phoneNumber: string;
  subordinates: subordinatesProps[];
  team: string;
}

interface DocArrayProps {
  node: {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
    level: string;
    managerId: string | null;
    team: string | null;
    subordinates: subordinatesProps[];
  };
  depth: number;
}

let docArray: DocArrayProps[] = [];

function buildHierarchy(employees: EmployeeProps[], managerId = "") {
  const subordinates: EmployeeProps[] = employees.filter(
    (emp: EmployeeProps) => emp.managerId === managerId
  );
  if (subordinates.length === 0) return null;

  const tree: EmployeeProps[] = [];
  subordinates.forEach((subordinate) => {
    const node = {
      ...subordinate,
      subordinates: buildHierarchy(employees, subordinate.id),
    };
    tree.push(node);
  });
  return tree;
}

function printTree(node: subordinatesProps, depth = 0) {
  docArray.push({ node, depth });
  console.log(docArray);
  if (node.subordinates) {
    node.subordinates.forEach((subordinate: subordinatesProps) =>
      printTree(subordinate, depth + 1)
    );
  }
}

function RepeatBlock({ times }: { times: number }) {
  // Create an array of length 'times' filled with null values
  const array = new Array(times).fill(null).map((_, index) => ({ key: index }));
  return (
    <>
      {array.map((item, index) => (
        <span
          className="w-[100px] h-[80px] p-[10px] m-[20px]"
          key={item.key}
        ></span>
      ))}
    </>
  );
}

function ThumbnailWithLetter({ letter }: { letter: string }) {
  return (
    <div className="w-[50px] h-[50px] rounded-full bg-slate-300 flex justify-center align-center text-[24px] font-bold p-[5px]">
      <div>{letter}</div>
    </div>
  );
}

const EmployeeTree = () => {
  docArray = [];
  let employees = useEmployee((store) => store.employees);
  const hierarchy = buildHierarchy(employees);
  if (hierarchy) {
    hierarchy.forEach((root) => printTree(root));
  }

  return (
    <div className="max-w-full">
      {docArray.map(({ node, depth }) => (
        <>
          {node.level === levels.L3 && (
            <div className="flex h-[100px] p-[10px]" key={node.id}>
              <RepeatBlock times={depth} />
              <div className="flex align-center w-[1000px] p-[20px] rounded-md shadow-md bg-blue-100">
                <div className="p-[20px]">Team Name : {node.team}</div>
              </div>
            </div>
          )}
          <div className="flex h-[100px] p-[10px]" key={node.id + 1}>
            <RepeatBlock times={node.level === levels.L3 ? depth + 1 : depth} />
            <div className="flex items-center w-[1000px] p-[20px] rounded-md shadow-md bg-blue-100">
              <ThumbnailWithLetter letter={node.name[0]} />
              <div className="p-[20px]">{node.name}</div>
              <div className="p-[20px]">Level : {node.level}</div>
              {/* <div className='emp-section-item'>Email : {node.email}</div>
              <div className='emp-section-item'>Phone : {node.phoneNumber}</div> */}
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default EmployeeTree;
