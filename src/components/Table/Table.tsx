import React, { useRef, CSSProperties } from 'react';

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	Row,
	useReactTable,
} from '@tanstack/react-table';
import { Table as StyledTable, TableWrapper } from './Table.styled';
import { Container } from 'styled/elements/Container';
import { useVirtual } from '@tanstack/react-virtual';

export type TableColumn<T> = ColumnDef<T> & {
	textAlign?: CSSProperties['textAlign'];
};

interface TableProps<T> {
	data: T[];
	columns: TableColumn<T>[];
}

const Table = <T extends unknown>({ data, columns }: TableProps<T>) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	const tableContainerRef = useRef<HTMLDivElement>(null);

	const { rows } = table.getRowModel();
	const rowVirtualizer = useVirtual({
		parentRef: tableContainerRef,
		size: rows.length,
		overscan: 10,
	});

	const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

	const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
	const paddingBottom =
		virtualRows.length > 0
			? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
			: 0;

	return (
		<Container>
			<TableWrapper ref={tableContainerRef}>
				<StyledTable>
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										style={{
											width: header.getSize() + 'px',
											textAlign: (header.column.columnDef as TableColumn<T>)
												.textAlign,
										}}
										key={header.id}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{paddingTop > 0 && (
							<tr>
								<td style={{ height: `${paddingTop}px` }} />
							</tr>
						)}
						{virtualRows.map((virtualRow) => {
							const row = rows[virtualRow.index] as Row<T>;
							return (
								<tr key={row.id}>
									{row.getVisibleCells().map((cell) => {
										return (
											<td
												style={{
													width: cell.column.getSize() + 'px',
													textAlign: (cell.column.columnDef as TableColumn<T>)
														.textAlign,
												}}
												key={cell.id}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
						{paddingBottom > 0 && (
							<tr>
								<td style={{ height: `${paddingBottom}px` }} />
							</tr>
						)}
					</tbody>
				</StyledTable>
			</TableWrapper>
		</Container>
	);
};

export default Table;
