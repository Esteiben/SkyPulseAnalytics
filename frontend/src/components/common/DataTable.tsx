interface DataTableProps {
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
  className?: string;
}

export default function DataTable({ headers, rows, className = '' }: DataTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-[#BEBEBE] text-on-background">
            {headers.map((h, i) => (
              <th key={i} className="p-4 font-label-lg text-label-lg uppercase tracking-wider font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#BEBEBE]/50 bg-surface-container-lowest">
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-surface-variant/30 transition-colors group">
              {row.map((cell, ci) => (
                <td key={ci} className="p-4 font-body-md text-body-md text-on-background">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
