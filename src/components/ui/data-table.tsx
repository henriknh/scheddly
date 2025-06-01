"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CustomColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  align?: "start" | "end";
  width?: number;
};

export type DataTableColumnDef<TData, TValue> = CustomColumnDef<TData, TValue>;

interface DataTableProps<TData, TValue> {
  columns: DataTableColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const columnDef = header.column.columnDef as CustomColumnDef<
                  TData,
                  TValue
                >;
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      maxWidth: columnDef.width
                        ? `${columnDef.width}px`
                        : undefined,
                      minWidth: columnDef.width
                        ? `${columnDef.width}px`
                        : undefined,
                      textAlign: columnDef.align === "end" ? "right" : "left",
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const columnDef = header.column.columnDef as CustomColumnDef<
                TData,
                TValue
              >;
              return (
                <TableHead
                  key={header.id}
                  style={{
                    maxWidth: columnDef.width
                      ? `${columnDef.width}px`
                      : undefined,
                    minWidth: columnDef.width
                      ? `${columnDef.width}px`
                      : undefined,
                    textAlign: columnDef.align === "end" ? "right" : "left",
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => {
                const columnDef = cell.column.columnDef as CustomColumnDef<
                  TData,
                  TValue
                >;
                return (
                  <TableCell
                    key={cell.id}
                    style={{
                      maxWidth: columnDef.width
                        ? `${columnDef.width}px`
                        : undefined,
                      minWidth: columnDef.width
                        ? `${columnDef.width}px`
                        : undefined,
                      textAlign: columnDef.align === "end" ? "right" : "left",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
