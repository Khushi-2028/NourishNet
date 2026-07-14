import { useMemo, useState } from "react";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";
import { SkeletonRow } from "./Skeleton";
import { cn } from "../../utils/cn";

/**
 * Generic data table.
 *
 * - If `serverPagination` is supplied ({ page, pages, onPageChange }),
 *   the table assumes `data` is already the current page's slice.
 * - Otherwise it paginates `data` client-side using `pageSize`, which
 *   is required for the several admin endpoints that return full
 *   unpaginated arrays (NGOs, volunteers, donations, deliveries,
 *   audit logs).
 */
const DataTable = ({
  columns,
  data = [],
  isLoading = false,
  keyField = "_id",
  pageSize = 10,
  serverPagination = null,
  emptyTitle = "No records found",
  emptyDescription = "",
  emptyIcon
}) => {
  const [clientPage, setClientPage] = useState(1);

  const totalClientPages = Math.max(1, Math.ceil(data.length / pageSize));

  const pageData = useMemo(() => {
    if (serverPagination) return data;
    const start = (clientPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, clientPage, pageSize, serverPagination]);

  const page = serverPagination ? serverPagination.page : clientPage;
  const pages = serverPagination ? serverPagination.pages : totalClientPages;
  const onPageChange = serverPagination
    ? serverPagination.onPageChange
    : setClientPage;

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} columns={columns.length} />
              ))}

            {!isLoading &&
              pageData.map((row) => (
                <tr
                  key={row[keyField]}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-slate-700 dark:text-slate-300 align-middle",
                        col.cellClassName
                      )}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && data.length === 0 && (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
        />
      )}

      {!isLoading && data.length > 0 && (
        <div className="px-4 pb-4">
          <Pagination page={page} pages={pages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};

export default DataTable;
